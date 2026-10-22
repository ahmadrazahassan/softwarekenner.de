/**
 * Display types for the software components. Phase 2 derives the content schemas (Section 10)
 * and maps them onto these props, so components never read files directly.
 */
import type { AwardKind } from "@/components/ui/award-seal";
import type { PriceUnit } from "@/lib/format";
import type { PlanPrice } from "@/lib/pricing";

export type Status = "ja" | "teilweise" | "nein" | "unbekannt";

export type Plan = PlanPrice & {
  highlights: string[];
  recommended?: boolean;
};

export type SoftwareSummary = {
  slug: string;
  name: string;
  vendorName: string;
  categoryLabel: string;
  logo?: string | null;
  /** Vendor brand color for the card banner tint. */
  brandColor: string;
  score: number;
  /** Entry price in cents per unit, or null for "Preis auf Anfrage". */
  priceFrom: { cents: number; unit: PriceUnit } | null;
  /** Number of real, verified user reviews. 0 shows the editorial label instead. */
  userReviewCount: number;
  handsOnTest: boolean;
  madeInGermany: boolean;
  award?: { kind: AwardKind; year: number };
  /** Link to the profile, later built by the route helpers. */
  href: string;
  /** Outgoing link: /go/[slug] with an active deal, else the vendor website. */
  outboundHref: string;
  affiliate: boolean;
};

export type CheckRow = {
  label: string;
  status: Status;
  note?: string;
  source?: { label: string; href: string };
};
