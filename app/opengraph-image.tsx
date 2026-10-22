import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { siteConfig } from "@/site.config";

export const alt = `${siteConfig.brand.name}: Software für Unternehmen in Deutschland im Vergleich`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Default share image for every page without its own (Section 20). */
export default function Image() {
  return ogCard({
    kicker: "Softwarevergleich für Unternehmen",
    title: "Die Software, die zu Ihrem Unternehmen passt.",
    facts: ["Preise in Euro", "Offene Methodik", "Deutschland-Check"],
  });
}
