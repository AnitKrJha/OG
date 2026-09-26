import type { ThemeName } from "./theme";

export interface CardParams {
  title: string;
  type?: string;
  description?: string;
  meta?: string;
  /** Validated absolute https URL on an allowed host. Not fetched yet. */
  image?: string;
  theme: ThemeName;
}

export const LIMITS = {
  title: 110,
  type: 24,
  description: 170,
  meta: 72,
} as const;

export const DEFAULT_TITLE = "Anit Jha";

export const ALLOWED_IMAGE_HOSTS = new Set([
  "anit.dev",
  "www.anit.dev",
  "og.anit.dev",
]);

/** Collapse whitespace and cut at `max` characters, ending with an ellipsis. */
export function clamp(value: string | null | undefined, max: number) {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return undefined;
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** Old URLs used lowercase plurals such as `type=blogs`. */
const LEGACY_TYPES: Record<string, string> = {
  blogs: "Blog",
  blog: "Blog",
  post: "Blog",
  posts: "Blog",
};

function normalizeType(value: string | undefined) {
  if (!value) return undefined;
  const legacy = LEGACY_TYPES[value.toLowerCase()];
  if (legacy) return legacy;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Returns the URL if it is an absolute https URL on an allowed host. */
export function allowedImageUrl(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return undefined;
    if (url.username || url.password || url.port) return undefined;
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function parseParams(searchParams: URLSearchParams): CardParams {
  // `variant` is no longer used; old `variant=profile` URLs render the default card.
  const theme: ThemeName =
    searchParams.get("theme")?.trim().toLowerCase() === "light"
      ? "light"
      : "dark";

  return {
    title: clamp(searchParams.get("title"), LIMITS.title) ?? DEFAULT_TITLE,
    type: normalizeType(clamp(searchParams.get("type"), LIMITS.type)),
    description: clamp(searchParams.get("description"), LIMITS.description),
    meta: clamp(searchParams.get("meta"), LIMITS.meta),
    image: allowedImageUrl(searchParams.get("image")),
    theme,
  };
}
