"use client";

import { useRef, useState } from "react";
import type { Field } from "@/admin/schema";

/**
 * The form engine. One renderer per field kind from `schema.ts`.
 *
 * Values are read and written through plain paths ("physical.elevation.ua",
 * "itinerary.3.title"), so the whole editor works on one immutable object and
 * a single onChange — no per-field state to keep in sync.
 */

/* ---- immutable get/set by path ------------------------------------------- */

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const isIndex = /^\d+$/.test(head);

  if (isIndex) {
    const arr = Array.isArray(obj) ? [...(obj as unknown[])] : [];
    const i = Number(head);
    arr[i] = rest.length ? setPath(arr[i], rest.join("."), value) : value;
    return arr as unknown as T;
  }

  const base = (obj && typeof obj === "object" ? obj : {}) as Record<string, unknown>;
  return {
    ...base,
    [head]: rest.length ? setPath(base[head], rest.join("."), value) : value,
  } as T;
}

export interface FieldProps {
  field: Field;
  path: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
  /** Uploads a file and resolves to the site path to store. */
  onUpload: (file: File) => Promise<string>;
}

/* ---- primitives ---------------------------------------------------------- */

function Label({ field }: { field: Field }) {
  return (
    <span className="af__label">
      {field.label}
      {field.required && <b className="af__req"> *</b>}
    </span>
  );
}

function Hint({ field }: { field: Field }) {
  if (!field.hint) return null;
  return <span className="af__hint">{field.hint}</span>;
}

function ImageInput({
  value,
  onChange,
  onUpload,
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await onUpload(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося завантажити файл");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="af__image">
      <div className="af__image-preview">
        {value ? (
          // Plain <img>: these are arbitrary editor-supplied paths inside an
          // admin screen that is never indexed, so next/image buys nothing.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <span className="af__image-empty">Немає фото</span>
        )}
      </div>
      <div className="af__image-side">
        <input
          className="af__input"
          value={value}
          placeholder="/media/…"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="af__image-actions">
          <button
            type="button"
            className="af__btn"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Завантаження…" : "Завантажити файл"}
          </button>
          {value && (
            <button type="button" className="af__btn af__btn--ghost" onClick={() => onChange("")}>
              Прибрати
            </button>
          )}
        </div>
        {error && <span className="af__error">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void pick(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

/** Two inputs side by side — the site ships both languages, so both are edited. */
function I18nInput({
  value,
  onChange,
  area,
}: {
  value: { ua?: string; en?: string } | undefined;
  onChange: (locale: "ua" | "en", v: string) => void;
  area?: boolean;
}) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="af__i18n">
      {(["ua", "en"] as const).map((l) => (
        <label key={l} className="af__i18n-cell">
          <span className="af__lang">{l === "ua" ? "Українською" : "English"}</span>
          <Tag
            className={area ? "af__input af__input--area" : "af__input"}
            value={value?.[l] ?? ""}
            rows={area ? 4 : undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
              onChange(l, e.target.value)
            }
          />
        </label>
      ))}
    </div>
  );
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <span className="af__row-tools">
      <button
        type="button"
        className="af__icon"
        title="Вище"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        ↑
      </button>
      <button
        type="button"
        className="af__icon"
        title="Нижче"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="af__icon af__icon--danger"
        title="Видалити"
        onClick={() => onRemove(index)}
      >
        ×
      </button>
    </span>
  );
}

/* ---- the dispatcher ------------------------------------------------------ */

export function FieldView({ field, path, value, onChange, onUpload }: FieldProps) {
  const set = (v: unknown) => onChange(path, v);

  const move = (list: unknown[], from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    set(next);
  };

  switch (field.kind) {
    case "text":
      return (
        <label className="af__field">
          <Label field={field} />
          <input
            className="af__input"
            value={(value as string) ?? ""}
            onChange={(e) => set(e.target.value)}
          />
          <Hint field={field} />
        </label>
      );

    case "textarea":
      return (
        <label className="af__field">
          <Label field={field} />
          <textarea
            className="af__input af__input--area"
            rows={4}
            value={(value as string) ?? ""}
            onChange={(e) => set(e.target.value)}
          />
          <Hint field={field} />
        </label>
      );

    case "number":
      return (
        <label className="af__field">
          <Label field={field} />
          <input
            className="af__input"
            type="number"
            value={Number(value ?? 0)}
            onChange={(e) => set(e.target.value === "" ? 0 : Number(e.target.value))}
          />
          <Hint field={field} />
        </label>
      );

    case "select": {
      // Booleans are edited as "true"/"false" strings and converted back here,
      // so the schema can describe them with the same `options` shape.
      const isBool = field.options?.every((o) => o.value === "true" || o.value === "false");
      const current = isBool ? String(Boolean(value)) : String(value ?? "");
      return (
        <label className="af__field">
          <Label field={field} />
          <select
            className="af__input"
            value={current}
            onChange={(e) => {
              const raw = e.target.value;
              if (isBool) set(raw === "true");
              else set(/^\d+$/.test(raw) ? Number(raw) : raw);
            }}
          >
            {field.options?.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
          <Hint field={field} />
        </label>
      );
    }

    case "image":
      return (
        <div className="af__field">
          <Label field={field} />
          <ImageInput
            value={(value as string) ?? ""}
            onChange={set}
            onUpload={onUpload}
          />
          <Hint field={field} />
        </div>
      );

    case "i18n":
    case "i18n-area":
      return (
        <div className="af__field">
          <Label field={field} />
          <I18nInput
            value={value as { ua?: string; en?: string }}
            area={field.kind === "i18n-area"}
            onChange={(l, v) => onChange(`${path}.${l}`, v)}
          />
          <Hint field={field} />
        </div>
      );

    case "i18n-list": {
      const list = (value as Array<{ ua?: string; en?: string }>) ?? [];
      return (
        <div className="af__field">
          <Label field={field} />
          <Hint field={field} />
          <div className="af__list">
            {list.map((item, i) => (
              <div key={i} className="af__list-row">
                <div className="af__list-body">
                  <I18nInput
                    value={item}
                    onChange={(l, v) => onChange(`${path}.${i}.${l}`, v)}
                  />
                </div>
                <RowTools
                  index={i}
                  count={list.length}
                  onMove={(f, t) => move(list, f, t)}
                  onRemove={(idx) => set(list.filter((_, k) => k !== idx))}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="af__btn af__btn--ghost"
            onClick={() => set([...list, { ua: "", en: "" }])}
          >
            {field.addLabel ?? "Додати"}
          </button>
        </div>
      );
    }

    case "i18n-paragraphs": {
      const v = (value as { ua?: string[]; en?: string[] }) ?? { ua: [], en: [] };
      return (
        <div className="af__field">
          <Label field={field} />
          <Hint field={field} />
          <div className="af__i18n">
            {(["ua", "en"] as const).map((l) => {
              const paras = v[l] ?? [];
              return (
                <div key={l} className="af__i18n-cell">
                  <span className="af__lang">{l === "ua" ? "Українською" : "English"}</span>
                  {paras.map((p, i) => (
                    <div key={i} className="af__list-row">
                      <textarea
                        className="af__input af__input--area"
                        rows={3}
                        value={p}
                        onChange={(e) => onChange(`${path}.${l}.${i}`, e.target.value)}
                      />
                      <RowTools
                        index={i}
                        count={paras.length}
                        onMove={(from, to) => {
                          if (to < 0 || to >= paras.length) return;
                          const next = [...paras];
                          const [item] = next.splice(from, 1);
                          next.splice(to, 0, item);
                          onChange(`${path}.${l}`, next);
                        }}
                        onRemove={(idx) =>
                          onChange(
                            `${path}.${l}`,
                            paras.filter((_, k) => k !== idx),
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="af__btn af__btn--ghost"
                    onClick={() => onChange(`${path}.${l}`, [...paras, ""])}
                  >
                    {field.addLabel ?? "Додати абзац"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "string-list": {
      const list = (value as string[]) ?? [];
      return (
        <div className="af__field">
          <Label field={field} />
          <Hint field={field} />
          <div className="af__list">
            {list.map((item, i) => (
              <div key={i} className="af__list-row">
                <div className="af__list-body">
                  <ImageInput
                    value={item}
                    onChange={(v) => onChange(`${path}.${i}`, v)}
                    onUpload={onUpload}
                  />
                </div>
                <RowTools
                  index={i}
                  count={list.length}
                  onMove={(f, t) => move(list, f, t)}
                  onRemove={(idx) => set(list.filter((_, k) => k !== idx))}
                />
              </div>
            ))}
          </div>
          <button type="button" className="af__btn af__btn--ghost" onClick={() => set([...list, ""])}>
            {field.addLabel ?? "Додати"}
          </button>
        </div>
      );
    }

    case "group":
      return (
        <fieldset className="af__group">
          <legend className="af__legend">{field.label}</legend>
          <div className="af__grid">
            {field.fields?.map((sub) => (
              <div key={sub.key} className={sub.wide ? "af__cell af__cell--wide" : "af__cell"}>
                <FieldView
                  field={sub}
                  path={`${path}.${sub.key}`}
                  value={getPath(value, sub.key)}
                  onChange={onChange}
                  onUpload={onUpload}
                />
              </div>
            ))}
          </div>
        </fieldset>
      );

    case "list": {
      const list = (value as Array<Record<string, unknown>>) ?? [];
      return (
        <div className="af__field">
          <Label field={field} />
          <Hint field={field} />
          <div className="af__items">
            {list.map((item, i) => {
              const titleField = field.titleKey ? item[field.titleKey] : undefined;
              const title =
                titleField && typeof titleField === "object"
                  ? ((titleField as { ua?: string }).ua ?? "")
                  : String(titleField ?? "");
              return (
                <details key={i} className="af__item">
                  <summary className="af__item-head">
                    <span className="af__item-n">{i + 1}</span>
                    <span className="af__item-title">{title || "Без назви"}</span>
                    <RowTools
                      index={i}
                      count={list.length}
                      onMove={(f, t) => move(list, f, t)}
                      onRemove={(idx) => set(list.filter((_, k) => k !== idx))}
                    />
                  </summary>
                  <div className="af__grid af__item-body">
                    {field.fields?.map((sub) => (
                      <div
                        key={sub.key}
                        className={sub.wide ? "af__cell af__cell--wide" : "af__cell"}
                      >
                        <FieldView
                          field={sub}
                          path={`${path}.${i}.${sub.key}`}
                          value={item[sub.key]}
                          onChange={onChange}
                          onUpload={onUpload}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
          <button
            type="button"
            className="af__btn af__btn--ghost"
            onClick={() => {
              const empty: Record<string, unknown> = {};
              field.fields?.forEach((sub) => {
                if (sub.kind === "i18n" || sub.kind === "i18n-area") empty[sub.key] = { ua: "", en: "" };
                else if (sub.kind === "i18n-list" || sub.kind === "string-list" || sub.kind === "list")
                  empty[sub.key] = [];
                else if (sub.kind === "number") empty[sub.key] = 0;
                else empty[sub.key] = "";
              });
              set([...list, empty]);
            }}
          >
            {field.addLabel ?? "Додати"}
          </button>
        </div>
      );
    }

    default:
      return null;
  }
}
