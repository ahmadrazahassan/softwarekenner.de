"use client";

import { useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { TabPanel, Tabs } from "@/components/ui/tabs";
import { SoftwareCard } from "@/components/software/cards";
import type { SoftwareSummary } from "@/components/software/types";

export type PopularTab = { slug: string; label: string; href: string; items: SoftwareSummary[] };

/**
 * "Bestbewertete Software je Kategorie" (Section 13.1, Reference 4; sorted by editorial score, not by popularity): uppercase tabs, card carousel,
 * and an outline "Zur Kategorie" button whose target follows the active tab.
 */
export function PopularSoftware({ tabs }: { tabs: PopularTab[] }) {
  const [active, setActive] = useState(tabs[0]?.slug ?? "");
  const current = tabs.find((t) => t.slug === active) ?? tabs[0];
  if (!current) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="type-h2 text-ink">Bestbewertete Software je Kategorie</h2>
        <ButtonLink href={current.href} variant="outline">
          Zur Kategorie
        </ButtonLink>
      </div>
      <Tabs
        label="Software nach Bereich"
        items={tabs.map((t) => ({ value: t.slug, label: t.label }))}
        value={active}
        onValueChange={setActive}
      >
        {tabs.map((tab) => (
          <TabPanel key={tab.slug} value={tab.slug} className="pt-8">
            <Carousel label={`Bestbewertete Software im Bereich ${tab.label}`}>
              {tab.items.map((software) => (
                <SoftwareCard key={software.slug} software={software} />
              ))}
            </Carousel>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
