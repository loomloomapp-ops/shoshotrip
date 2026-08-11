/**
 * Client for the admin back end (`/admin-api.php`).
 *
 * The panel used to hold a GitHub token in the browser. It no longer does:
 * the editor signs in with a password they choose on first visit, and the
 * server keeps the GitHub credentials. Nothing secret reaches this file.
 *
 * Content still lives as JSON in the repository — git is the store, there is
 * no database — but the browser only ever talks to our own PHP endpoint.
 */

const ENDPOINT = "/admin-api.php";

export type FileKey = "tours" | "team" | "reviews";

export interface Status {
  /** A password has been set, so the panel shows the login screen. */
  configured: boolean;
  /** The current session is signed in. */
  authed: boolean;
  /** admin.config.php exists on the server (GitHub credentials present). */
  ready: boolean;
}

export interface LoadedFile<T> {
  data: T;
  /** Blob SHA — sent back on save so a parallel edit is not clobbered. */
  sha: string;
}

async function call<T>(
  action: string,
  init?: { method?: "GET" | "POST"; body?: unknown; query?: Record<string, string> },
): Promise<T> {
  const params = new URLSearchParams({ action, ...(init?.query ?? {}) });
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${params}`, {
      method: init?.method ?? "GET",
      credentials: "same-origin",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("Немає зв'язку з сервером. Перевірте інтернет і спробуйте ще раз.");
  }

  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    // A PHP fatal or an HTML error page — surfacing the raw dump helps nobody.
    throw new Error(
      res.status === 404
        ? "Не знайдено admin-api.php. Схоже, сайт викладено не повністю."
        : `Сервер повернув несподівану відповідь (${res.status}).`,
    );
  }

  if (!res.ok) {
    const message = (body as { error?: string }).error;
    throw new Error(message || `Помилка ${res.status}`);
  }
  return body as T;
}

export function getStatus(): Promise<Status> {
  return call<Status>("status");
}

/** First run only: the editor chooses the password. */
export function setupPassword(password: string): Promise<{ ok: true }> {
  return call("setup", { method: "POST", body: { password } });
}

export function login(password: string): Promise<{ ok: true }> {
  return call("login", { method: "POST", body: { password } });
}

export function logout(): Promise<{ ok: true }> {
  return call("logout", { method: "POST", body: {} });
}

export function loadFile<T>(file: FileKey): Promise<LoadedFile<T>> {
  return call<LoadedFile<T>>("load", { query: { file } });
}

export function saveFile(
  file: FileKey,
  data: unknown,
  sha: string,
  message: string,
): Promise<{ sha: string }> {
  return call("save", { method: "POST", query: { file }, body: { data, sha, message } });
}

/** Upload an image and get back the site path to store in the content. */
export async function uploadImage(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const CHUNK = 0x8000; // chunked, or a large photo blows the argument limit
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  const res = await call<{ path: string }>("upload", {
    method: "POST",
    body: { name: safeName(file.name), content: btoa(binary) },
  });
  return res.path;
}

/**
 * A collision-proof, URL-safe file name. Cyrillic and spaces would survive
 * into the URL and break on some hosts, so they are dropped rather than
 * escaped. Must satisfy the pattern the PHP side enforces.
 */
export function safeName(original: string): string {
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
