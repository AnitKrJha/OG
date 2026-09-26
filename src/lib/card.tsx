import type { CSSProperties, ReactNode } from "react";
import type { CardParams } from "./params";
import { softBlob, themes, rgba, type Theme } from "./theme";
import { LOGO_PATHS, LOGO_VIEWBOX, SIGNATURE_PATHS } from "./marks";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const FONT_FAMILY = "Bricolage Grotesque";

const PAD_X = 72;
const PAD_Y = 60;

export interface CardAssets {
  /** Data URL of the cover image, already fetched and validated. */
  imageSrc?: string;
}

export type CardProps = CardParams & CardAssets;

/* ─── Type scale ───────────────────────────────────────────────────────── */

function titleSize(length: number, narrow: boolean) {
  const steps = narrow
    ? [
        [16, 80],
        [28, 70],
        [44, 60],
        [64, 52],
        [86, 46],
        [Infinity, 42],
      ]
    : [
        [16, 112],
        [28, 96],
        [44, 82],
        [64, 70],
        [86, 62],
        [Infinity, 56],
      ];
  return steps.find(([max]) => length <= max)![1];
}

const tight = (size: number, em = -0.035) => Math.round(size * em * 100) / 100;

/* ─── Pieces ───────────────────────────────────────────────────────────── */

function Aurora({ t }: { t: Theme }) {
  const [a1, a2, a3, a4] = t.aurora;
  const s = t.auroraOpacity;
  const blobs = [
    softBlob(a1, "44% 68%", "12% 6%", s),
    softBlob(a2, "36% 56%", "50% -4%", s * 0.95),
    softBlob(a3, "42% 66%", "90% 10%", s),
    softBlob(a4, "50% 46%", "36% 38%", s * 0.8),
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        backgroundImage: [
          // Fade the aurora into the page towards the bottom, like the site's mask.
          `linear-gradient(to bottom, ${rgba(t.bgRgb, 0)} 0%, ${rgba(t.bgRgb, 0)} 30%, ${rgba(t.bgRgb, 0.7)} 62%, ${rgba(t.bgRgb, 1)} 88%)`,
          ...blobs,
        ].join(", "),
      }}
    />
  );
}

function Logo({ color, height }: { color: string; height: number }) {
  return (
    <svg
      width={(height * 46) / 32}
      height={height}
      viewBox={LOGO_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} fill={color} stroke={color} strokeWidth={0.4848} />
      ))}
    </svg>
  );
}

function Signature({ color, height }: { color: string; height: number }) {
  // Crop to the handwritten part (skip the small monogram above it).
  return (
    <svg
      width={(height * 45) / 17}
      height={height}
      viewBox="0 14 45 17"
      xmlns="http://www.w3.org/2000/svg"
    >
      {SIGNATURE_PATHS.slice(0, 2).map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  );
}

function Pill({ t, children }: { t: Theme; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 44,
        padding: "0 20px 0 16px",
        borderRadius: 999,
        backgroundColor: t === themes.dark ? "rgba(11, 12, 22, 0.42)" : "rgba(253, 249, 245, 0.6)",
        boxShadow: `inset 0 0 0 1.5px ${t === themes.dark ? "rgba(245, 241, 236, 0.16)" : "rgba(21, 21, 32, 0.12)"}`,
        color: t.ink,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: tight(22, -0.005),
      }}
    >
      <div
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          backgroundColor: t.accent,
          marginRight: 11,
          boxShadow: `0 0 0 4px ${t === themes.dark ? "rgba(255, 164, 110, 0.18)" : "rgba(200, 51, 26, 0.14)"}`,
        }}
      />
      {children}
    </div>
  );
}

function TopRow({ t, type }: { t: Theme; type?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Logo color={t.ink} height={30} />
        <div
          style={{
            marginLeft: 16,
            fontSize: 27,
            fontWeight: 600,
            color: t.ink,
            letterSpacing: tight(27, -0.02),
          }}
        >
          anit.dev
        </div>
      </div>
      {type ? <Pill t={t}>{type}</Pill> : null}
    </div>
  );
}

function Footer({
  t,
  meta,
  name = true,
  signature = true,
}: {
  t: Theme;
  meta?: string;
  name?: boolean;
  signature?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1.5px solid ${t.line}`,
        paddingTop: 26,
        height: 78,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", fontSize: 24, flex: 1, minWidth: 0 }}>
        {name ? (
          <div style={{ color: t.ink, fontWeight: 600, letterSpacing: tight(24, -0.015), flexShrink: 0 }}>
            Anit Jha
          </div>
        ) : null}
        {name && meta ? (
          <div
            style={{
              width: 5,
              height: 5,
              flexShrink: 0,
              borderRadius: 999,
              backgroundColor: t.ink3,
              margin: "0 16px",
              opacity: 0.8,
            }}
          />
        ) : null}
        {meta ? (
          <div
            style={{
              display: "block",
              color: t.ink3,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              minWidth: 0,
            }}
          >
            {meta}
          </div>
        ) : null}
      </div>
      {signature ? (
        <div style={{ display: "flex", marginLeft: 32, flexShrink: 0 }}>
          <Signature color={t.ink3} height={34} />
        </div>
      ) : null}
    </div>
  );
}

function Frame({
  t,
  src,
  width,
  height,
  radius,
}: {
  t: Theme;
  src: string;
  width: number;
  height: number;
  radius: number;
}) {
  const ring = 8;
  const dark = t === themes.dark;
  return (
    <div
      style={{
        display: "flex",
        padding: ring,
        borderRadius: radius + ring,
        backgroundColor: dark ? "rgba(245, 241, 236, 0.06)" : "rgba(255, 255, 255, 0.55)",
        boxShadow: dark
          ? "inset 0 0 0 1.5px rgba(245, 241, 236, 0.12), 0 24px 60px rgba(0, 0, 0, 0.45)"
          : "inset 0 0 0 1.5px rgba(21, 21, 32, 0.08), 0 24px 60px rgba(60, 40, 30, 0.16)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={width}
        height={height}
        alt=""
        style={{
          width,
          height,
          objectFit: "cover",
          borderRadius: radius,
        }}
      />
    </div>
  );
}

/* ─── Layouts ──────────────────────────────────────────────────────────── */

function Shell({ t, children }: { t: Theme; children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: t.bg,
        fontFamily: FONT_FAMILY,
        color: t.ink2,
      }}
    >
      <Aurora t={t} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: `${PAD_Y}px ${PAD_X}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const blockText = (style: CSSProperties): CSSProperties => ({
  display: "block",
  ...style,
});

/** Keep the last two words together so a line never ends with a lone word. */
const noOrphan = (text: string) => text.replace(/ (\S{1,12})$/, "\u00a0$1");

const same = (a?: string, b?: string) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

function DefaultCard(p: CardProps) {
  const t = themes[p.theme];
  // Avoid saying the same thing twice, e.g. the legacy `?title=Blog&type=blogs`.
  const type = same(p.type, p.title) ? undefined : p.type;
  const showName = !same(p.title, "Anit Jha");
  const withImage = Boolean(p.imageSrc);
  const size = titleSize(p.title.length, withImage);
  const textWidth = withImage ? 520 : OG_WIDTH - PAD_X * 2;
  const descSize = withImage ? 26 : 29;

  return (
    <Shell t={t}>
      <TopRow t={t} type={type} />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: textWidth,
            paddingBottom: 8,
          }}
        >
          <div
            style={blockText({
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: tight(size),
              color: t.ink,
              lineClamp: 4,
              // Satori's balancing is only reliable for short titles.
              ...(p.title.length <= 48 ? { textWrap: "balance" as const } : {}),
            })}
          >
            {p.title}
          </div>
          {p.description ? (
            <div
              style={blockText({
                marginTop: size > 70 ? 26 : 22,
                fontSize: descSize,
                fontWeight: 400,
                lineHeight: 1.42,
                letterSpacing: tight(descSize, -0.01),
                color: t.ink2,
                lineClamp: withImage ? 3 : 2,
                maxWidth: withImage ? textWidth : 940,
              })}
            >
              {noOrphan(p.description)}
            </div>
          ) : null}
        </div>
        {withImage ? (
          <Frame t={t} src={p.imageSrc!} width={456} height={264} radius={16} />
        ) : null}
      </div>
      <Footer t={t} meta={p.meta} name={showName} />
    </Shell>
  );
}

export function Card(props: CardProps) {
  return <DefaultCard {...props} />;
}

/* ─── Fonts ────────────────────────────────────────────────────────────── */

export type FontWeightData = Record<400 | 500 | 600 | 700, ArrayBuffer>;

export function ogFonts(data: FontWeightData) {
  return (Object.entries(data) as Array<[string, ArrayBuffer]>).map(([weight, buf]) => ({
    name: FONT_FAMILY,
    data: buf,
    weight: Number(weight) as 400 | 500 | 600 | 700,
    style: "normal" as const,
  }));
}

export const FONT_FILES = {
  400: "BricolageGrotesque-Regular.ttf",
  500: "BricolageGrotesque-Medium.ttf",
  600: "BricolageGrotesque-SemiBold.ttf",
  700: "BricolageGrotesque-Bold.ttf",
} as const;
