import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { Stage } from "@/components/stage/stage";

import "@/app/globals.css";

/** Paper Mono, variable weight 100–800 (OFL 1.1). The only face on the site. */
const paperMono = localFont({
  src: "./fonts/PaperMono-wght.woff2",
  variable: "--font-paper-mono",
  weight: "100 800",
  display: "swap",
});

const THEME_BOOT = `document.documentElement.dataset.theme=/^\\/photography\\/?$/.test(location.pathname)?"dark":"light"`;

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

/**
 * The font variable is set on `<html>` so the `:root` token in `globals.css`
 * can see it. `THEME_BOOT` sets `data-theme` before first paint (photography
 * opens dark, the rest light: `ZONE_THEMES`); the field engine owns it after.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={paperMono.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <Stage>{children}</Stage>
      </body>
    </html>
  );
}
