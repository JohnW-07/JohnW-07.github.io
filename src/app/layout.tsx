import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { AdaptiveGrid } from "@/components/common/grid";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollRail } from "@/components/site/scroll-rail";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { THEME_BOOTSTRAP, ThemeSync } from "@/components/site/theme-sync";
import { ScrollLayout } from "@/layouts/scroll-layout";

import "@/app/globals.css";

/**
 * Display face. Variable serif carrying a true optical-size axis.
 *
 * `opsz` (9–144) is the reason this face replaced Instrument Serif: it ships a
 * genuinely different cut at each size, so a 144px headline gets the wide
 * apertures and tightened spacing a display cut needs, while a 28px subhead
 * gets a text cut, from one file. The previous face was a single narrow cut
 * stretched across the whole range and then given stacked negative tracking on
 * top, which is what made large headings read as jammed together.
 *
 * `SOFT` and `WONK` are pinned in `globals.css`, not here — they are design
 * decisions per type step, not font-loading concerns. WONK stays at 0 so the
 * face keeps the instrument register rather than turning quirky.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Body / UI face. Neo-grotesque, quiet enough to sit under the serif. */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Telemetry face. Every label, unit, timestamp and measurement is set in it. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

/**
 * The font variables are set on `<html>`, not `<body>`.
 *
 * `globals.css` composes them into design tokens on `:root`
 * (`--font-display-family: var(--font-fraunces), …`), and a custom
 * property's value is substituted where it is *declared*. A token declared on
 * `:root` therefore cannot see a variable defined on a descendant. Put the
 * font variables on `<body>` and every face on the site silently falls back to
 * a system font with no error anywhere.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The bootstrap script stamps `data-theme` on this element before React
      // hydrates, which is the whole point of it. Suppress the resulting
      // attribute mismatch warning; nothing else on <html> is dynamic.
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${plexMono.variable}`}
    >
      <body className="grain bg-paper text-ink antialiased">
        {/* Stamps the compartment theme before first paint. See theme-sync. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <ScrollLayout>
          <AdaptiveGrid />
          <ReducedMotion />
          <ThemeSync />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ScrollRail />
        </ScrollLayout>
      </body>
    </html>
  );
}
