import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ALLOWED_IMAGE_HOSTS } from "./params";
import { FONT_FILES, type FontWeightData } from "./card";

const ASSETS_DIR = join(process.cwd(), "src", "assets");

let fontsPromise: Promise<FontWeightData> | undefined;
let portraitPromise: Promise<string> | undefined;

async function readAsset(name: string) {
  const buf = await readFile(join(ASSETS_DIR, name));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/** Bricolage Grotesque in the weights the card uses. Cached per instance. */
export function loadFonts(): Promise<FontWeightData> {
  fontsPromise ??= (async () => {
    const entries = await Promise.all(
      Object.entries(FONT_FILES).map(
        async ([weight, file]) => [weight, await readAsset(file)] as const,
      ),
    );
    return Object.fromEntries(entries) as unknown as FontWeightData;
  })().catch((error) => {
    fontsPromise = undefined;
    throw error;
  });
  return fontsPromise;
}

export function loadPortrait(): Promise<string> {
  portraitPromise ??= readFile(join(ASSETS_DIR, "anit-portrait.jpg"))
    .then((buf) => `data:image/jpeg;base64,${buf.toString("base64")}`)
    .catch((error) => {
      portraitPromise = undefined;
      throw error;
    });
  return portraitPromise;
}

/** Formats satori can decode. WebP and AVIF are not supported by it. */
function sniffMime(bytes: Uint8Array): string | undefined {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  return undefined;
}

export function bytesToDataUrl(bytes: Uint8Array): string | undefined {
  const mime = sniffMime(bytes);
  if (!mime) return undefined;
  return `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`;
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_REDIRECTS = 3;

/**
 * Fetch a cover image from an allowed host and return it as a data URL.
 * Never throws: any failure (timeout, bad host, redirect elsewhere, unsupported
 * format, too large) resolves to undefined so the card renders without it.
 */
export async function fetchImageAsDataUrl(
  url: string,
  timeoutMs = 2500,
): Promise<string | undefined> {
  try {
    const signal = AbortSignal.timeout(timeoutMs);
    let current = new URL(url);

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (
        current.protocol !== "https:" ||
        current.username ||
        current.password ||
        current.port ||
        !ALLOWED_IMAGE_HOSTS.has(current.hostname.toLowerCase())
      ) {
        return undefined;
      }

      const res = await fetch(current, {
        signal,
        redirect: "manual",
        headers: { accept: "image/png,image/jpeg,image/gif;q=0.9,*/*;q=0.1" },
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return undefined;
        current = new URL(location, current);
        continue;
      }
      if (!res.ok) return undefined;

      const declared = Number(res.headers.get("content-length") ?? 0);
      if (declared > MAX_IMAGE_BYTES) return undefined;

      const bytes = new Uint8Array(await res.arrayBuffer());
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return undefined;
      return bytesToDataUrl(bytes);
    }
    return undefined;
  } catch {
    return undefined;
  }
}
