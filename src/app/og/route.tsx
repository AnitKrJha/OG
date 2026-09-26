import { fetchImageAsDataUrl } from "@/lib/assets";
import { parseParams } from "@/lib/params";
import { CACHE_CONTROL, renderPng } from "@/lib/render";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const params = parseParams(new URL(request.url).searchParams);
    const imageSrc =
      params.image ? await fetchImageAsDataUrl(params.image) : undefined;

    const png = await renderPng(params, { imageSrc });

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("og: failed to generate image", error);
    return new Response("Failed to generate image", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
