/**
 * Render sample cards to PNGs without a server.
 *   node --import tsx scripts/preview.tsx [outDir]
 * Uses the same Card, params parser and renderer as /og.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { bytesToDataUrl } from "../src/lib/assets";
import { parseParams } from "../src/lib/params";
import { renderPng } from "../src/lib/render";

const outDir = process.argv[2] ?? "/tmp/og-preview";
const coverPath =
  process.env.OG_PREVIEW_COVER ??
  join(process.cwd(), "scripts", "fixtures", "cover.jpg");

const samples: Record<string, string> = {
  "01-default": "",
  "02-short": "title=Blog&type=Writing",
  "03-long":
    "title=How I rebuilt my personal site around a single quiet column and one soft aurora gradient that drifts&type=Blog",
  "04-desc-meta":
    "title=Customising the GRUB theme on Fedora&type=Blog&description=A step by step guide to replacing the default boot menu with a clean, readable theme that survives kernel updates.&meta=Oct 15, 2023 · 8 min read",
  "05-image":
    "title=SoftlyDrawn&type=Project&description=A portfolio and commissions site for an illustrator, built to feel like a sketchbook.&meta=2026 · Astro, React, TypeScript&image=https://anit.dev/cover.jpg",
  "06-image-long":
    "title=Growth Sense: financial calculators that explain the maths behind every number&type=Project&description=Calculators for SIP, lumpsum and EMI with charts, plain language and zero sign up.&meta=2024 · Next.js, Tailwind&image=https://anit.dev/cover.jpg",
  "07-profile":
    "variant=profile&description=Software engineer building calm, fast interfaces for the web.&meta=Writing, projects and notes",
  "08-light":
    "title=Customising the GRUB theme on Fedora&type=Blog&description=A step by step guide to replacing the default boot menu with a clean, readable theme that survives kernel updates.&meta=Oct 15, 2023 · 8 min read&theme=light",
  "09-legacy": "title=Blog&type=blogs",
  "10-light-image":
    "title=SoftlyDrawn&type=Project&description=A portfolio and commissions site for an illustrator, built to feel like a sketchbook.&meta=2026 · Astro, React, TypeScript&image=https://anit.dev/cover.jpg&theme=light",
  "11-light-profile":
    "variant=profile&theme=light&description=Software engineer building calm, fast interfaces for the web.&meta=Writing, projects and notes",
  "12-bad-image": "title=Untrusted host is ignored&type=Project&image=https://evil.example.com/x.png",
  "14-playground-meta":
    "title=Open Graph images, rendered from a URL&type=Tool&description=Blog posts, projects and the home page all share one calm, on brand card.&meta=og.anit.dev",
  "15-image-mid":
    "title=Stashing work in progress with git stash&type=Blog&description=Park half finished changes, switch branches and come back without losing a line.&meta=Mar 2, 2024 · 5 min read&image=https://anit.dev/cover.jpg",
  "13-max":
    "title=" +
    "Word ".repeat(40) +
    "&type=Projects&description=" +
    "Description text that goes on and on ".repeat(8) +
    "&meta=" +
    "Very long meta line ".repeat(6),
};

async function main() {
  mkdirSync(outDir, { recursive: true });
  let coverSrc: string | undefined;
  try {
    coverSrc = bytesToDataUrl(new Uint8Array(readFileSync(coverPath)));
  } catch {
    console.warn(`no cover fixture at ${coverPath}, image samples render without it`);
  }

  const only = process.argv[3];
  for (const [name, query] of Object.entries(samples)) {
    if (only && !name.includes(only)) continue;
    const params = parseParams(new URLSearchParams(query));
    // Simulate the server-side fetch with a local file for allowed hosts.
    const imageSrc = params.image && params.variant === "default" ? coverSrc : undefined;
    const started = performance.now();
    const png = await renderPng(params, { imageSrc });
    const file = join(outDir, `${name}.png`);
    writeFileSync(file, Buffer.from(png));
    console.log(`${file}  ${Math.round(performance.now() - started)}ms`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
