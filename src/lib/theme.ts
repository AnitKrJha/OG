/**
 * anit.dev "Aurora" tokens, converted from the site's OKLCH values to sRGB
 * because satori does not understand oklch().
 */

export type ThemeName = "dark" | "light";

type Rgb = readonly [number, number, number];

export interface Theme {
  bg: string;
  surface: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  lineStrong: string;
  accent: string;
  /** Aurora colours as RGB triplets so we can build soft alpha ramps. */
  aurora: readonly [Rgb, Rgb, Rgb, Rgb];
  auroraOpacity: number;
  bgRgb: Rgb;
}

export const themes: Record<ThemeName, Theme> = {
  dark: {
    bg: "#0b0c16", // oklch(0.16 0.02 280)
    surface: "#161722", // oklch(0.21 0.022 280)
    ink: "#f5f1ec", // oklch(0.96 0.008 75)
    ink2: "#bcbdc7", // oklch(0.8 0.014 280)
    ink3: "#90919d", // oklch(0.66 0.018 280)
    line: "#242530", // oklch(0.27 0.02 280)
    lineStrong: "#3b3c49", // oklch(0.36 0.022 280)
    accent: "#ffa46e", // oklch(0.8 0.13 50)
    aurora: [
      [55, 59, 167], // indigo  oklch(0.42 0.17 275)
      [150, 2, 109], // magenta oklch(0.45 0.19 345)
      [186, 79, 31], // ember   oklch(0.56 0.15 42)
      [0, 88, 107], // teal    oklch(0.42 0.09 215)
    ],
    auroraOpacity: 0.74,
    bgRgb: [11, 12, 22],
  },
  light: {
    bg: "#fdf9f5", // oklch(0.985 0.007 70)
    surface: "#f6efe9", // oklch(0.955 0.011 65)
    ink: "#151520", // oklch(0.2 0.022 285)
    ink2: "#464652", // oklch(0.4 0.02 285)
    ink3: "#676873", // oklch(0.52 0.018 285)
    line: "#e4ddd6", // oklch(0.9 0.012 65)
    lineStrong: "#c5bcb3", // oklch(0.8 0.016 65)
    accent: "#c8331a", // oklch(0.55 0.19 32)
    aurora: [
      [255, 192, 145], // peach  oklch(0.86 0.1 55)
      [255, 153, 167], // rose   oklch(0.8 0.13 12)
      [199, 175, 245], // lilac  oklch(0.8 0.1 300)
      [250, 232, 162], // butter oklch(0.93 0.09 95)
    ],
    auroraOpacity: 0.9,
    bgRgb: [253, 249, 245],
  },
};

export function rgba([r, g, b]: Rgb, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`;
}

/**
 * A radial gradient whose alpha follows a smooth, roughly gaussian falloff.
 * Satori has no blur filter, so this ramp is what makes the blobs feel soft.
 */
export function softBlob(
  color: Rgb,
  size: string,
  at: string,
  strength: number,
): string {
  const stops: Array<[number, number]> = [
    [1, 0],
    [0.9, 16],
    [0.68, 34],
    [0.42, 52],
    [0.2, 70],
    [0.07, 86],
    [0, 100],
  ];
  const ramp = stops
    .map(([a, p]) => `${rgba(color, a * strength)} ${p}%`)
    .join(", ");
  return `radial-gradient(${size} at ${at}, ${ramp})`;
}
