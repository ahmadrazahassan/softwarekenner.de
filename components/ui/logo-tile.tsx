import Image from "next/image";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

const SIZES = { 40: "size-10", 48: "size-12", 72: "size-18", 88: "size-22", 96: "size-24" } as const;

/**
 * Vendor logo tile (Section 5.8): white, radius 16, official SVG from public/logos.
 * Without a logo it shows a monogram in Outfit 700 on brand-50. Never hotlink.
 */
export function LogoTile({
  name,
  logo,
  size = 72,
  className,
}: {
  name: string;
  /** Path below /public, e.g. "/logos/musterbuch.svg". */
  logo?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex flex-none items-center justify-center overflow-hidden rounded-logo border border-line shadow-sm",
        logo ? "bg-white" : "bg-brand-50",
        SIZES[size],
        className,
      )}
      // Percentage padding would resolve against the parent width, so it is set from the tile size.
      style={logo ? { padding: Math.round(size * 0.14) } : undefined}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`Logo ${name}`}
          width={size}
          height={size}
          unoptimized
          className="size-full object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-display font-bold tracking-tight text-brand-ink"
          style={{ fontSize: size * 0.34 }}
        >
          {initials(name)}
        </span>
      )}
      {!logo && <span className="sr-only">{name}</span>}
    </span>
  );
}
