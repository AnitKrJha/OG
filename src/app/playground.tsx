"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LIMITS } from "@/lib/params";

type ThemeName = "dark" | "light";

interface Fields {
  title: string;
  type: string;
  description: string;
  meta: string;
  image: string;
  theme: ThemeName;
}

const EMPTY: Fields = {
  title: "",
  type: "",
  description: "",
  meta: "",
  image: "",
  theme: "dark",
};

const PRESETS: Array<{ name: string; fields: Partial<Fields> }> = [
  {
    name: "Blog post",
    fields: {
      title: "Customising the GRUB theme on Fedora",
      type: "Blog",
      description:
        "A step by step guide to replacing the default boot menu with a clean, readable theme that survives kernel updates.",
      meta: "Oct 15, 2023 · 8 min read",
    },
  },
  {
    name: "Project",
    fields: {
      title: "SoftlyDrawn",
      type: "Project",
      description: "A portfolio and commissions site for an illustrator, built to feel like a sketchbook.",
      meta: "2026 · Astro, React, TypeScript",
    },
  },
  {
    name: "Home",
    fields: {
      title: "Anit Jha",
      description: "DevOps, Tools & Automation Engineer at Apple",
      meta: "Kubernetes · Crossplane · Go · React",
    },
  },
  { name: "Section", fields: { title: "Writing", type: "Blog" } },
];

function buildQuery(f: Fields) {
  const q = new URLSearchParams();
  for (const key of ["title", "type", "description", "meta", "image"] as const) {
    const value = f[key].trim();
    if (value) q.set(key, value);
  }
  if (f.theme !== "dark") q.set("theme", f.theme);
  const s = q.toString().replace(/\+/g, "%20");
  return s ? `/og?${s}` : "/og";
}

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

function Field({
  label,
  hint,
  count,
  max,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  count?: number;
  max?: number;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={htmlFor}>{label}</label>
        {max !== undefined ? (
          <span className={`count${count! > max ? " over" : ""}`}>
            {count}/{max}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: T;
  options: Array<[T, string]>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="segmented">
        {options.map(([v, text]) => (
          <label key={v} className={value === v ? "on" : undefined}>
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
            />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Playground() {
  const id = useId();
  const [fields, setFields] = useState<Fields>({ ...EMPTY, ...PRESETS[0].fields });
  const set = <K extends keyof Fields>(key: K) => (value: Fields[K]) =>
    setFields((f) => ({ ...f, [key]: value }));

  const path = useMemo(() => buildQuery(fields), [fields]);
  const previewPath = useDebounced(path, 350);
  const [origin, setOrigin] = useState("https://og.anit.dev");
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}${path}`;

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => setStatus("loading"), [previewPath]);

  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  const imageInvalid =
    fields.image.trim() !== "" &&
    !/^https:\/\/(www\.|og\.)?anit\.dev\//i.test(fields.image.trim());

  return (
    <section className="playground" aria-label="Playground">
      <form className="panel form" onSubmit={(e) => e.preventDefault()}>
        <div className="presets" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className="chip"
              onClick={() => setFields({ ...EMPTY, theme: fields.theme, ...p.fields })}
            >
              {p.name}
            </button>
          ))}
          <button type="button" className="chip ghost" onClick={() => setFields({ ...EMPTY, theme: fields.theme })}>
            Clear
          </button>
        </div>

        <Field label="Title" htmlFor={`${id}-title`} count={fields.title.length} max={LIMITS.title}>
          <input
            id={`${id}-title`}
            value={fields.title}
            placeholder="Anit Jha"
            onChange={(e) => set("title")(e.target.value)}
          />
        </Field>

        <div className="row">
          <Field label="Type" htmlFor={`${id}-type`}>
            <input
              id={`${id}-type`}
              list={`${id}-types`}
              value={fields.type}
              placeholder="Blog"
              onChange={(e) => set("type")(e.target.value)}
            />
            <datalist id={`${id}-types`}>
              {["Blog", "Project", "Projects", "Writing", "Notes", "Talk"].map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Meta" htmlFor={`${id}-meta`}>
            <input
              id={`${id}-meta`}
              value={fields.meta}
              placeholder="Oct 15, 2023 · 8 min read"
              onChange={(e) => set("meta")(e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Description"
          htmlFor={`${id}-description`}
          count={fields.description.length}
          max={LIMITS.description}
        >
          <textarea
            id={`${id}-description`}
            rows={3}
            value={fields.description}
            placeholder="Optional supporting line"
            onChange={(e) => set("description")(e.target.value)}
          />
        </Field>

        <Field
          label="Cover image"
          htmlFor={`${id}-image`}
          hint={
            imageInvalid
              ? "Only https URLs on anit.dev are used. This one will be ignored."
              : "Optional. PNG, JPEG or GIF on anit.dev, shown on the right."
          }
        >
          <input
            id={`${id}-image`}
            type="url"
            inputMode="url"
            value={fields.image}
            placeholder="https://anit.dev/…/cover.png"
            aria-invalid={imageInvalid || undefined}
            onChange={(e) => set("image")(e.target.value)}
          />
        </Field>

        <div className="row">
          <Segmented
            label="Theme"
            name={`${id}-theme`}
            value={fields.theme}
            options={[
              ["dark", "Dark"],
              ["light", "Light"],
            ]}
            onChange={set("theme")}
          />
        </div>
      </form>

      <div className="preview">
        <div className={`frame ${status}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={previewPath}
            src={previewPath}
            width={1200}
            height={630}
            alt={`Preview of the card for “${fields.title || "Anit Jha"}”`}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />
          {status === "error" ? <p className="frame-error">Could not render this card.</p> : null}
        </div>

        <div className="url-bar">
          <code className="url" title={url}>
            {url}
          </code>
          <button type="button" className="button" onClick={copy} aria-live="polite">
            {copied ? "Copied" : "Copy URL"}
          </button>
        </div>
        <div className="preview-links">
          <a href={path} target="_blank" rel="noreferrer">
            Open image
          </a>
          <span aria-hidden="true">·</span>
          <span>1200 × 630 PNG</span>
        </div>
      </div>
    </section>
  );
}
