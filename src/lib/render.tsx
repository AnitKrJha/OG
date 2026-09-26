import { ImageResponse } from "next/og";
import { Card, OG_HEIGHT, OG_WIDTH, ogFonts, type CardAssets } from "./card";
import type { CardParams } from "./params";
import { loadFonts, loadPortrait } from "./assets";

export const CACHE_CONTROL = "public, immutable, no-transform, max-age=31536000";

/**
 * Render a card to PNG bytes. Rendering is awaited here (instead of streaming)
 * so failures can be caught, and a card whose cover image trips the renderer
 * is retried without the image.
 */
export async function renderPng(
  params: CardParams,
  assets: CardAssets = {},
): Promise<ArrayBuffer> {
  const [fonts, portraitSrc] = await Promise.all([
    loadFonts(),
    params.variant === "profile" ? loadPortrait() : Promise.resolve(undefined),
  ]);

  const draw = (extra: CardAssets) =>
    new ImageResponse(<Card {...params} {...extra} portraitSrc={portraitSrc} />, {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: ogFonts(fonts),
    }).arrayBuffer();

  if (assets.imageSrc) {
    try {
      return await draw({ imageSrc: assets.imageSrc });
    } catch (error) {
      console.warn("og: cover image could not be rendered, dropping it", error);
    }
  }
  return draw({});
}
