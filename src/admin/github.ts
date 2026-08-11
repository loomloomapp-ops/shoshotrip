/**
 * GitHub as the content store.
 *
 * The published site is a static export on shared hosting, so there is no
 * server to POST to and no database. Instead the admin panel talks to the
 * GitHub Contents API straight from the browser: reading a JSON file gives the
 * current content, writing it back creates a commit, and a GitHub Actions
 * workflow rebuilds the site and uploads it over FTP.
 *
 * That means git is the database — every save is a reviewable, revertable
 * commit with an author and a timestamp.
 *
 * Auth is a fine-grained personal access token, scoped to this one repository
 * with "Contents: read and write". It is held in localStorage on the editor's
 * own machine and never leaves the browser except in the Authorization header.
 */

const API = "https://api.github.com";

export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface LoadedFile<T> {
  data: T;
  /** Blob SHA — required to write the file back without clobbering a newer edit. */
  sha: string;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** Turn a GitHub error body into something an editor can act on. */
async function fail(res: Response): Promise<never> {
  let detail = "";
  try {
    const body = (await res.json()) as { message?: string };
    detail = body.message ?? "";
  } catch {
    /* non-JSON error body — the status is enough */
  }
  const map: Record<number, string> = {
    401: "Токен недійсний або прострочений. Створіть новий і збережіть його ще раз.",
    403: "Токен не має права на запис у цей репозиторій (потрібно Contents: read and write).",
    404: "Файл або репозиторій не знайдено. Перевірте назву репозиторію та гілку.",
    409: "Файл змінився з моменту завантаження. Перезавантажте сторінку і внесіть правку ще раз.",
    422: "GitHub відхилив зміну. Найчастіше це означає, що файл уже оновили паралельно.",
  };
  throw new GitHubError(map[res.status] ?? detail ?? `GitHub error ${res.status}`, res.status);
}

/* ---- base64 <-> UTF-8 ------------------------------------------------------
   atob/btoa are byte-oriented, and this content is full of Cyrillic, so the
   string has to go through TextEncoder/TextDecoder or every non-ASCII
   character comes back mangled. */

function encodeUtf8Base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function decodeUtf8Base64(b64: string): string {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Bytes -> base64, for image uploads. */
export function bytesToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const CHUNK = 0x8000; // avoid blowing the argument limit on large files
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** Verify a token and confirm it can actually write to this repository. */
export async function checkAccess(ref: RepoRef, token: string): Promise<string> {
  const res = await fetch(`${API}/repos/${ref.owner}/${ref.repo}`, {
    headers: headers(token),
  });
  if (!res.ok) await fail(res);
  const repo = (await res.json()) as { permissions?: { push?: boolean }; full_name: string };
  if (!repo.permissions?.push) {
    throw new GitHubError(
      "Токен читає репозиторій, але не має права запису. Увімкніть Contents: read and write.",
      403,
    );
  }
  return repo.full_name;
}

/** Read and parse a JSON file from the repository. */
export async function loadJson<T>(
  ref: RepoRef,
  token: string,
  path: string,
): Promise<LoadedFile<T>> {
  const url = `${API}/repos/${ref.owner}/${ref.repo}/contents/${path}?ref=${encodeURIComponent(ref.branch)}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) await fail(res);
  const body = (await res.json()) as { content: string; sha: string };
  return { data: JSON.parse(decodeUtf8Base64(body.content)) as T, sha: body.sha };
}

/**
 * Write a JSON file back as a commit. Returns the new SHA so the editor can
 * keep saving without a reload.
 */
export async function saveJson(
  ref: RepoRef,
  token: string,
  path: string,
  data: unknown,
  message: string,
  sha: string,
): Promise<string> {
  const text = JSON.stringify(data, null, 2) + "\n";
  const res = await fetch(`${API}/repos/${ref.owner}/${ref.repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: encodeUtf8Base64(text),
      sha,
      branch: ref.branch,
    }),
  });
  if (!res.ok) await fail(res);
  const body = (await res.json()) as { content: { sha: string } };
  return body.content.sha;
}

/**
 * Upload an image into `public/media/uploads/` and return the site-absolute
 * path to store in the content JSON. Existing files are overwritten only when
 * the caller passes the current SHA, so a name clash never silently replaces
 * someone else's photo — `uniqueName` avoids clashes in the first place.
 */
export async function uploadImage(
  ref: RepoRef,
  token: string,
  fileName: string,
  bytes: ArrayBuffer,
): Promise<string> {
  const path = `public/media/uploads/${fileName}`;
  const res = await fetch(`${API}/repos/${ref.owner}/${ref.repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `admin: upload ${fileName}`,
      content: bytesToBase64(bytes),
      branch: ref.branch,
    }),
  });
  if (!res.ok) await fail(res);
  return `/media/uploads/${fileName}`;
}

/**
 * A collision-proof, URL-safe file name. Cyrillic and spaces in the original
 * name would survive into the URL and break on some hosts, so they are dropped
 * rather than escaped.
 */
export function uniqueName(original: string): string {
  const dot = original.lastIndexOf(".");
  const ext = (dot > -1 ? original.slice(dot + 1) : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = (dot > -1 ? original.slice(0, dot) : original)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const stamp = Math.random().toString(36).slice(2, 8);
  return `${base || "image"}-${stamp}.${ext || "jpg"}`;
}
