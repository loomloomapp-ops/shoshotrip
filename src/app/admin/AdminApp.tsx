"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  checkAccess,
  loadJson,
  saveJson,
  uniqueName,
  uploadImage,
  type RepoRef,
} from "@/admin/github";
import { schemas, slugify, type EntitySchema } from "@/admin/schema";
import { FieldView, getPath, setPath } from "@/admin/Fields";

/**
 * The admin panel.
 *
 * Entirely client-side: the published site is a static export with no server,
 * so this page loads content from GitHub, edits it in memory, and commits it
 * back. A GitHub Actions workflow then rebuilds and uploads the site.
 *
 * Nothing here is bundled into the public pages — this route is noindexed and
 * excluded from the sitemap.
 */

type Row = Record<string, unknown>;

const TOKEN_KEY = "shosho.admin.token";
const REPO_KEY = "shosho.admin.repo";

const DEFAULT_REPO =
  process.env.NEXT_PUBLIC_ADMIN_REPO || "loomloomapp-ops/shoshotrip";
const DEFAULT_BRANCH = process.env.NEXT_PUBLIC_ADMIN_BRANCH || "main";

function parseRepo(value: string, branch: string): RepoRef | null {
  const [owner, repo] = value.trim().replace(/^https:\/\/github\.com\//, "").split("/");
  if (!owner || !repo) return null;
  return { owner, repo: repo.replace(/\.git$/, ""), branch };
}

/** Localized-or-plain label for a list row. */
function rowLabel(row: Row, key: string): string {
  const v = row[key];
  if (v && typeof v === "object") return (v as { ua?: string }).ua ?? "";
  return String(v ?? "");
}

export function AdminApp() {
  const [token, setToken] = useState("");
  const [repoInput, setRepoInput] = useState(DEFAULT_REPO);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);

  const [active, setActive] = useState<EntitySchema>(schemas[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [sha, setSha] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const repo = useMemo(() => parseRepo(repoInput, DEFAULT_BRANCH), [repoInput]);

  /* Restore a previous session. The token lives only in this browser. */
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    const savedRepo = localStorage.getItem(REPO_KEY);
    if (savedRepo) setRepoInput(savedRepo);
    if (saved) {
      setToken(saved);
      setReady(true);
    }
  }, []);

  /* Warn before losing unsaved edits. */
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const openEntity = useCallback(
    async (schema: EntitySchema) => {
      if (!repo || !token) return;
      setLoading(true);
      setError("");
      setStatus("");
      try {
        const file = await loadJson<Row[]>(repo, token, schema.path);
        setActive(schema);
        setRows(file.data);
        setSha(file.sha);
        setSelected(null);
        setDirty(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    },
    [repo, token],
  );

  useEffect(() => {
    if (ready) void openEntity(active);
    // Loading the first entity once the session is ready; `active` is set inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  async function signIn() {
    if (!repo) {
      setAuthError("Вкажіть репозиторій у форматі власник/назва");
      return;
    }
    setChecking(true);
    setAuthError("");
    try {
      await checkAccess(repo, token);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REPO_KEY, repoInput);
      setReady(true);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Не вдалося перевірити токен");
    } finally {
      setChecking(false);
    }
  }

  function signOut() {
    if (dirty && !confirm("Є незбережені зміни. Вийти і втратити їх?")) return;
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setReady(false);
    setRows([]);
    setSelected(null);
    setDirty(false);
  }

  const onUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!repo || !token) throw new Error("Немає доступу до репозиторію");
      const bytes = await file.arrayBuffer();
      return uploadImage(repo, token, uniqueName(file.name), bytes);
    },
    [repo, token],
  );

  function updateField(path: string, value: unknown) {
    if (selected === null) return;
    setRows((prev) => {
      const next = [...prev];
      next[selected] = setPath(next[selected], path, value) as Row;
      return next;
    });
    setDirty(true);
    setStatus("");
  }

  function addRow() {
    const blank = active.blank() as Row;
    setRows((prev) => [...prev, blank]);
    setSelected(rows.length);
    setDirty(true);
  }

  function removeRow(index: number) {
    const label = rowLabel(rows[index], active.labelKey) || "цей запис";
    if (!confirm(`Видалити «${label}»? Це збережеться у наступному коміті.`)) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
    setSelected(null);
    setDirty(true);
  }

  /**
   * Fill in the identity fields the site relies on but the editor should not
   * have to think about, then check that nothing required is empty.
   */
  function prepare(list: Row[]): { rows: Row[]; problem: string } {
    const next = list.map((row) => {
      const copy = { ...row };
      if (active.name === "tours") {
        if (!copy.slug) copy.slug = slugify(rowLabel(copy, "name"));
        if (!copy.id) copy.id = copy.slug;
      } else if (!copy.id) {
        copy.id =
          active.name === "reviews"
            ? `r${Date.now().toString(36)}`
            : slugify(rowLabel(copy, "name")) || `member-${Date.now().toString(36)}`;
      }
      return copy;
    });

    for (const [i, row] of next.entries()) {
      for (const f of active.fields) {
        if (!f.required) continue;
        const v = row[f.key];
        const empty =
          v == null ||
          v === "" ||
          (typeof v === "object" && !Array.isArray(v) && !(v as { ua?: string }).ua);
        if (empty) {
          return { rows: next, problem: `Запис ${i + 1}: не заповнено «${f.label}»` };
        }
      }
    }

    const slugs = next.map((r) => String(r.slug ?? r.id));
    const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (dupe) return { rows: next, problem: `Дві однакові адреси сторінки: ${dupe}` };

    return { rows: next, problem: "" };
  }

  async function save() {
    if (!repo || !token) return;
    const { rows: prepared, problem } = prepare(rows);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newSha = await saveJson(
        repo,
        token,
        active.path,
        prepared,
        `admin: оновлено ${active.title.toLowerCase()}`,
        sha,
      );
      setRows(prepared);
      setSha(newSha);
      setDirty(false);
      setStatus("Збережено. Сайт оновиться за кілька хвилин, коли завершиться збірка.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося зберегти");
    } finally {
      setLoading(false);
    }
  }

  /* ---- login ------------------------------------------------------------- */

  if (!ready) {
    return (
      <div className="ad__gate">
        <div className="ad__gate-card">
          <h1 className="ad__gate-title">ShoSho Trip — панель контенту</h1>
          <p className="ad__gate-text">
            Вхід за токеном GitHub. Токен зберігається лише у цьому браузері й нікуди не
            передається, окрім самого GitHub.
          </p>
          <label className="af__field">
            <span className="af__label">Репозиторій</span>
            <input
              className="af__input"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="власник/назва"
            />
          </label>
          <label className="af__field">
            <span className="af__label">Токен доступу</span>
            <input
              className="af__input"
              type="password"
              value={token}
              autoComplete="current-password"
              onChange={(e) => setToken(e.target.value)}
              placeholder="github_pat_…"
            />
            <span className="af__hint">
              Потрібен fine-grained токен із дозволом Contents: read and write на цей
              репозиторій. Як його створити — описано в ADMIN.md.
            </span>
          </label>
          {authError && <p className="af__error">{authError}</p>}
          <button className="af__btn" type="button" disabled={checking || !token} onClick={() => void signIn()}>
            {checking ? "Перевіряємо…" : "Увійти"}
          </button>
        </div>
      </div>
    );
  }

  /* ---- panel ------------------------------------------------------------- */

  const current = selected !== null ? rows[selected] : null;

  return (
    <div className="ad">
      <header className="ad__top">
        <strong className="ad__brand">ShoSho Trip</strong>
        <nav className="ad__tabs">
          {schemas.map((s) => (
            <button
              key={s.name}
              type="button"
              className={`ad__tab${s.name === active.name ? " is-active" : ""}`}
              onClick={() => {
                if (dirty && !confirm("Є незбережені зміни. Перейти і втратити їх?")) return;
                void openEntity(s);
              }}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <div className="ad__top-right">
          {dirty && <span className="ad__dirty">Є незбережені зміни</span>}
          <button
            type="button"
            className="af__btn"
            disabled={!dirty || loading}
            onClick={() => void save()}
          >
            {loading ? "Зберігаємо…" : "Зберегти"}
          </button>
          <button type="button" className="af__btn af__btn--ghost" onClick={signOut}>
            Вийти
          </button>
        </div>
      </header>

      {(error || status) && (
        <div className={`ad__banner${error ? " is-error" : ""}`}>{error || status}</div>
      )}

      <div className="ad__body">
        <aside className="ad__list">
          <div className="ad__list-head">
            <span>
              {active.title} ({rows.length})
            </span>
            <button type="button" className="af__btn af__btn--ghost" onClick={addRow}>
              Додати
            </button>
          </div>
          {loading && rows.length === 0 && <p className="ad__muted">Завантаження…</p>}
          {!loading && rows.length === 0 && (
            <p className="ad__muted">Поки порожньо. Натисніть «Додати».</p>
          )}
          <ul className="ad__rows">
            {rows.map((row, i) => (
              <li key={String(row[active.idKey] ?? i)}>
                <button
                  type="button"
                  className={`ad__row${selected === i ? " is-active" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  <span className="ad__row-title">
                    {rowLabel(row, active.labelKey) || "Без назви"}
                  </span>
                  {active.name === "tours" && (
                    <span className="ad__row-sub">{String(row.slug ?? "")}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="ad__editor">
          {current === null ? (
            <p className="ad__muted ad__empty">
              Оберіть запис зліва або натисніть «Додати».
            </p>
          ) : (
            <>
              <div className="ad__editor-head">
                <h2 className="ad__editor-title">
                  {rowLabel(current, active.labelKey) || "Новий запис"}
                </h2>
                <button
                  type="button"
                  className="af__btn af__btn--danger"
                  onClick={() => removeRow(selected as number)}
                >
                  Видалити
                </button>
              </div>
              <div className="af__grid">
                {active.fields.map((f) => (
                  <div key={f.key} className={f.wide ? "af__cell af__cell--wide" : "af__cell"}>
                    <FieldView
                      field={f}
                      path={f.key}
                      value={getPath(current, f.key)}
                      onChange={updateField}
                      onUpload={onUpload}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
