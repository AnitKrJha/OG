# og.anit.dev

Open Graph images for [anit.dev](https://anit.dev), rendered on the fly from a URL. The cards use the site's "Aurora" look: a soft gradient over deep ink (or warm paper), Bricolage Grotesque, the AJ mark and the handwritten signature.

The landing page at [og.anit.dev](https://og.anit.dev) is a playground: fill in the fields, watch the preview, copy the URL.

## URL

```
https://og.anit.dev/og?title=...&type=...&description=...&meta=...&image=...&variant=...&theme=...
```

Every parameter is optional. Output is a 1200 × 630 PNG.

| Param | What it does |
| --- | --- |
| `title` | Headline. Defaults to `Anit Jha`. Clamped to 110 characters; the size steps down as it gets longer (up to 4 lines). |
| `type` | Small label shown as a pill in the top right, e.g. `Blog`, `Project`, `Projects`, `Writing`. Legacy `blogs` becomes `Blog`. Hidden when it repeats the title. |
| `description` | Supporting line under the title. Clamped to 170 characters and 2 lines (3 next to an image). |
| `meta` | Footer detail next to "Anit Jha", e.g. `Oct 15, 2023 · 8 min read` or `2026 · Astro, React, TypeScript`. |
| `image` | Absolute `https` URL of a cover image, shown as a framed thumbnail on the right. Only `anit.dev`, `www.anit.dev` and `og.anit.dev` are allowed, and it must be PNG, JPEG or GIF (satori cannot decode WebP or AVIF). Fetched server side with a 2.5 s timeout; on any failure the card renders without it. |
| `variant` | `default` or `profile`. Profile is the home page card: portrait, big name (`title`) and a role line (`description`). |
| `theme` | `dark` (default) or `light`. |

Responses are sent with `Cache-Control: public, immutable, no-transform, max-age=31536000`, so change a parameter to get a fresh image. Unexpected errors return a plain text 500.

### Examples

```
/og?title=Customising%20the%20GRUB%20theme%20on%20Fedora&type=Blog&meta=Oct%2015%2C%202023%20%C2%B7%208%20min%20read
/og?title=SoftlyDrawn&type=Project&description=A%20portfolio%20for%20an%20illustrator.&meta=2026%20%C2%B7%20Astro&image=https%3A%2F%2Fanit.dev%2Fcover.png
/og?variant=profile&description=Software%20engineer%20building%20calm%2C%20fast%20interfaces.
/og?title=Writing&type=Blog&theme=light
/og?title=Blog&type=blogs
```

```html
<meta property="og:image" content="https://og.anit.dev/og?title=Hello&type=Blog" />
<meta name="twitter:card" content="summary_large_image" />
```

## Development

```sh
pnpm install
pnpm dev        # playground on http://localhost:3000, image at /og
pnpm build
pnpm preview    # render sample cards to /tmp/og-preview without a server
```

`pnpm preview [outDir] [filter]` uses the same card and renderer as the route, with `scripts/fixtures/cover.jpg` standing in for a fetched cover.

## Layout

- `src/app/og/route.tsx`: the image route (Node.js runtime).
- `src/lib/card.tsx`: the card JSX, type scale and layouts.
- `src/lib/params.ts`: parsing, clamping and the image host allowlist.
- `src/lib/assets.ts`: fonts, portrait and the guarded cover image fetch.
- `src/lib/theme.ts`: Aurora tokens converted from OKLCH to sRGB for satori.
- `src/app/page.tsx`, `src/app/playground.tsx`: the playground.
