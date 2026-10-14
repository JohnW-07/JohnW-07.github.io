import Image from "next/image";

import { MonoLabel } from "@/components/ui/mono-label";
import type { AssetSlot } from "@/data/types";

interface AssetFrameProps {
  asset: AssetSlot;
  /** Aspect ratio as a CSS ratio string, e.g. "3 / 4". */
  ratio?: string;
  className?: string;
  /** Shown in the corner of an empty frame. Usually a frame number. */
  marker?: string;
  /** What a visitor sees inside an empty frame. Keep it a plain noun. */
  publicLabel?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * The drop-in path is authoring information, not visitor information. It shows
 * in development so John can see where the file goes, and never in production.
 */
const isAuthoring = process.env.NODE_ENV === "development";

/**
 * An image, or an honest hole where one will go.
 *
 * A placeholder here is not a grey box pretending to be a photograph. It is
 * the mark a print layout uses for an unplaced image: cropped corner brackets,
 * a diagonal cross, and the filename that belongs in the slot. It looks
 * deliberate at a glance and it tells John exactly what to drop in.
 */
export const AssetFrame = ({
  asset,
  ratio = "3 / 4",
  className = "",
  marker,
  publicLabel,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 40vw",
}: AssetFrameProps) => {
  if (asset.kind === "image") {
    return (
      <div
        className={`relative overflow-hidden bg-paper-2 ${className}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-paper-2 ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={publicLabel ? `${publicLabel}, not yet published` : "Image not yet published"}
    >
      {/* Diagonal cross. Drawn as SVG so it stays a hairline at every scale. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-line-strong"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Corner brackets, offset outward the way registration marks are. */}
      <span aria-hidden="true" className="absolute -top-px -left-px h-4 w-4 border-t border-l border-safelight" />
      <span aria-hidden="true" className="absolute -right-px -bottom-px h-4 w-4 border-r border-b border-safelight" />

      {marker ? (
        <MonoLabel tone="signal" className="absolute top-3 right-3">
          {marker}
        </MonoLabel>
      ) : null}

      {publicLabel ? (
        <MonoLabel className="absolute inset-x-3 top-1/2 -translate-y-1/2 bg-paper-2 py-1 text-center">
          {publicLabel}
        </MonoLabel>
      ) : null}

      {isAuthoring ? (
        <MonoLabel
          tone="data"
          className="absolute right-2 bottom-2 left-2 truncate bg-paper-2 py-1 text-center"
        >
          {asset.note}
        </MonoLabel>
      ) : null}
    </div>
  );
};
