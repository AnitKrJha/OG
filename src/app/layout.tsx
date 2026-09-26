import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

const bricolage = localFont({
  src: [
    { path: "../assets/BricolageGrotesque-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/BricolageGrotesque-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/BricolageGrotesque-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../assets/BricolageGrotesque-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const title = "OG image generator for anit.dev";
const description =
  "Open Graph cards for anit.dev, rendered on the fly from a URL. Pick a title, a label and an optional cover, then copy the link.";
const ogImage =
  "/og?title=Open%20Graph%20images%2C%20rendered%20from%20a%20URL&type=Tool&description=Blog%20posts%2C%20projects%20and%20the%20home%20page%20all%20share%20one%20calm%2C%20on%20brand%20card.&meta=og.anit.dev";

export const metadata: Metadata = {
  metadataBase: new URL("https://og.anit.dev"),
  title,
  description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "anit.dev",
    title,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c16" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  );
}
