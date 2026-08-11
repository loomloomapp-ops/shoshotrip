"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStatus,
  loadFile,
  login as apiLogin,
  logout as apiLogout,
  saveFile,
  setupPassword,
  uploadImage,
  type Status,
} from "@/admin/api";
import { schemas, slugify, type EntitySchema } from "@/admin/schema";
import { FieldView, getPath, setPath } from "@/admin/Fields";

/**
 * The content panel.
 *
 * Sign-in is a password the editor sets on their first visit; the server holds
 * the GitHub credentials and does the committing, so nothing secret lives in
 * this browser. See `admin-api.php`.
 */

type Row = Record<string, unknown>;
type Screen = "loading" | "setup" | "login" | "panel";

/** Localized-or-plain label for a list row. */
function rowLabel(row: Row, key: string): string {
  const v = row[key];
  if (v && typeof v === "object") return (v as { ua?: string }).ua ?? "";
  return String(v ?? "");
}

export function AdminApp() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [serverReady, setServerReady] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  const [active, setActive] = useState<EntitySchema>(schemas[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [sha, setSha] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Which screen to show is the server's call, not the browser's. */
  useEffect(() => {
    getStatus()
      .then((s: Status) => {
        setServerReady(s.ready);
        setScreen(s.authed ? "panel" : s.configured ? "login" : "setup");
      })
      .catch((e) => {
        setAuthError(e instanceof Error ? e.message : "Сервер недоступний");
        setScreen("login");
      });
  }, []);

  /* Warn before losing unsaved edits. */
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const openEntity = useCallback(async (schema: EntitySchema) => {
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const file = await loadFile<Row[]>(schema.name);
      setActive(schema);
      setRows(Array.isArray(file.data) ? file.data : []);
      setSha(file.sha);
      setSelected(null);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (screen === "panel") void openEntity(active);
    // Loads the current section once the panel opens; `active` is set inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  async function submitSetup() {
    if (password.length < 10) {
      setAuthError("Пароль має бути не коротшим за 10 символів.");
      return;
    }
    if (password !== password2) {
      setAuthError("Паролі не збігаються.");
      return;
    }
    setBusy(true);
    setAuthError("");
    try {
      await setupPassword(password);
      setPassword("");
      setPassword2("");
      setScreen("panel");
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Не вдалося зберегти пароль");
    } finally {
      setBusy(false);
    }
  }

  async function submitLogin() {
    setBusy(true);
    setAuthError("");
    try {
      await apiLogin(password);
      setPassword("");
      setScreen("panel");
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Не вдалося увійти");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (dirty && !confirm("Є незбережені зміни. Вийти і втратити їх?")) return;
    await apiLogout().catch(() => {});
    setRows([]);
    setSelected(null);
    setDirty(false);
    setScreen("login");
  }

  const onUpload = useCallback((file: File) => uploadImage(file), []);

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
    setRows((prev) => [...prev, active.blank() as Row]);
    setSelected(rows.length);
    setDirty(true);
  }

  function removeRow(index: number) {
    const label = rowLabel(rows[index], active.labelKey) || "цей запис";
    if (!confirm(`Видалити «${label}»? Зміна набуде чинності після збереження.`)) return;
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
        if (empty) return { rows: next, problem: `Запис ${i + 1}: не заповнено «${f.label}»` };
      }
    }

    const keys = next.map((r) => String(r.slug ?? r.id));
    const dupe = keys.find((s, i) => keys.indexOf(s) !== i);
    if (dupe) return { rows: next, problem: `Дві однакові адреси сторінки: ${dupe}` };

    return { rows: next, problem: "" };
  }

  async function save() {
    const { rows: prepared, problem } = prepare(rows);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await saveFile(
        active.name,
        prepared,
        sha,
        `admin: оновлено ${active.title.toLowerCase()}`,
      );
      setRows(prepared);
      setSha(res.sha);
      setDirty(false);
      setStatus("Збережено. Сайт оновиться за кілька хвилин, коли завершиться збірка.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося зберегти");
    } finally {
      setLoading(false);
    }
  }

  /* ---- gates ------------------------------------------------------------- */

  if (screen === "loading") {
    return (
      <div className="ad__gate">
        <p className="ad__muted">Завантаження…</p>
      </div>
    );
  }

  if (screen === "setup" || screen === "login") {
    const isSetup = screen === "setup";
    return (
      <div className="ad__gate">
        <div className="ad__gate-card">
          <h1 className="ad__gate-title">
            {isSetup ? "Створіть пароль" : "ShoSho Trip — панель контенту"}
          </h1>
          <p className="ad__gate-text">
            {isSetup
              ? "Це перший вхід. Придумайте пароль — далі заходитимете лише за ним. Зробіть це зараз: доки пароль не встановлено, панель відкрита."
              : "Введіть пароль, щоб редагувати тури, команду й відгуки."}
          </p>

          {!serverReady && (
            <p className="af__error">
              На сервері немає admin.config.php — збереження не працюватиме, доки його не
              додати. Опис у ADMIN.md.
            </p>
          )}

          <label className="af__field">
            <span className="af__label">Пароль</span>
            <input
              className="af__input"
              type="password"
              value={password}
              autoComplete={isSetup ? "new-password" : "current-password"}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSetup) void submitLogin();
              }}
            />
            {isSetup && <span className="af__hint">Не менше 10 символів.</span>}
          </label>

          {isSetup && (
            <label className="af__field">
              <span className="af__label">Пароль ще раз</span>
              <input
                className="af__input"
                type="password"
                value={password2}
                autoComplete="new-password"
                onChange={(e) => setPassword2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitSetup();
                }}
              />
            </label>
          )}

          {authError && <p className="af__error">{authError}</p>}

          <button
            className="af__btn"
            type="button"
            disabled={busy || !password}
            onClick={() => void (isSetup ? submitSetup() : submitLogin())}
          >
            {busy ? "Зачекайте…" : isSetup ? "Зберегти пароль і увійти" : "Увійти"}
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
          <button type="button" className="af__btn af__btn--ghost" onClick={() => void signOut()}>
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
            <p className="ad__muted ad__empty">Оберіть запис зліва або натисніть «Додати».</p>
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
