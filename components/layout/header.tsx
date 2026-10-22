"use client";

import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";
import { Accordion as AccordionPrimitive, Dialog as DialogPrimitive, NavigationMenu } from "radix-ui";
import { useEffect, useState } from "react";

import {
  CommandPalette,
  useCommandShortcut,
  useShortcutLabel,
  type SearchItem,
} from "@/components/search/command-palette";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SheetContent } from "@/components/ui/overlay";
import { formatNumber } from "@/lib/format";
import { CATEGORIES, categoryHref, MAIN_NAV, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

import { Wordmark } from "./wordmark";

export type HeaderProps = {
  /** Only these categories appear in the menus (the visible ones). All when omitted. */
  categorySlugs?: string[];
  /** Profile count per category slug, computed from content. Hidden while unknown. */
  categoryCounts?: Record<string, number>;
  popularComparisons?: { label: string; href: string }[];
  guideTeaser?: { title: string; href: string };
  /** Main navigation without hubs that have no content yet. All items when omitted. */
  mainNav?: NavItem[];
  /** Demo items for the styleguide. Pages leave it out; the palette loads the search index. */
  searchItems?: SearchItem[];
};

const navLink =
  "type-label inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 text-ink transition-colors hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-ink data-[state=open]:bg-surface-tint";

/**
 * Site header (Section 7.1): sticky, 72 px, 85 % surface with blur, border after 8 px scroll.
 * Mega menu on Radix Navigation Menu, search with Strg K, ink CTA, full height mobile sheet.
 */
export function Header({
  categorySlugs,
  categoryCounts,
  popularComparisons = [],
  guideTeaser,
  mainNav = MAIN_NAV,
  searchItems,
}: HeaderProps) {
  const categories = categorySlugs ? CATEGORIES.filter((c) => categorySlugs.includes(c.slug)) : CATEGORIES;
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shortcut = useShortcutLabel();
  const openSearch = () => setSearchOpen(true);
  useCommandShortcut(openSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = (slug: string) => categoryCounts?.[slug];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-surface/85 backdrop-blur-md transition-colors duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <div className="container-wide flex h-18 items-center gap-4">
        <Wordmark />

        <NavigationMenu.Root aria-label="Hauptnavigation" className="relative mx-auto hidden lg:block">
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={cn(navLink, "group")}>
                Kategorien
                <Icon
                  icon={ChevronDown}
                  size={16}
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="data-[state=open]:animate-pop-in">
                <div className="grid w-[min(68rem,calc(100vw-4rem))] grid-cols-[1fr_16rem] gap-0">
                  <ul className="grid grid-cols-3 gap-1 p-4">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <NavigationMenu.Link asChild>
                          <AppLink
                            href={categoryHref(category.slug)}
                            className="flex min-h-12 items-center gap-3 rounded-sm px-3 py-2 text-ink transition-colors hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-ink"
                          >
                            <Icon icon={category.icon} size={20} className="flex-none text-text-muted" />
                            <span className="flex-1 type-label leading-snug">{category.name}</span>
                            {count(category.slug) !== undefined && (
                              <span className="type-small text-text-subtle tabular-nums">
                                {formatNumber(count(category.slug)!)}
                              </span>
                            )}
                          </AppLink>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-5 border-l border-line bg-surface-tint p-6">
                    {popularComparisons.length > 0 && (
                      <div>
                        <p className="type-micro text-text-muted">Beliebte Vergleiche</p>
                        <ul className="mt-2 flex flex-col">
                          {popularComparisons.map((item) => (
                            <li key={item.href}>
                              <NavigationMenu.Link asChild>
                                <AppLink
                                  href={item.href}
                                  className="flex min-h-10 items-center type-label text-ink hover:text-brand-ink hover:underline"
                                >
                                  {item.label}
                                </AppLink>
                              </NavigationMenu.Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {guideTeaser && (
                      <div className="mt-auto rounded-md border border-line bg-white p-4">
                        <p className="type-micro text-text-muted">Leitfaden</p>
                        <p className="mt-1 type-label font-semibold text-ink">{guideTeaser.title}</p>
                        <NavigationMenu.Link asChild>
                          <TextLink href={guideTeaser.href} className="text-small">
                            Zum Leitfaden
                          </TextLink>
                        </NavigationMenu.Link>
                      </div>
                    )}
                    <NavigationMenu.Link asChild>
                      <TextLink href="/kategorien">Alle Kategorien</TextLink>
                    </NavigationMenu.Link>
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            {mainNav.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild>
                  <AppLink href={item.href} className={navLink}>
                    {item.label}
                  </AppLink>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
            <NavigationMenu.Viewport className="overflow-hidden rounded-xl border border-line bg-white shadow-lg" />
          </div>
        </NavigationMenu.Root>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-white px-3 type-label text-text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-ink sm:pr-2 sm:pl-4"
          >
            <Icon icon={Search} size={20} />
            <span className="sr-only sm:not-sr-only">Suchen</span>
            <kbd className="hidden rounded-xs border border-line bg-surface-tint px-1.5 py-1 type-micro normal-case sm:inline">
              <span className="sr-only">Tastenkürzel </span>
              {shortcut}
            </kbd>
          </button>
          <ButtonLink href="/beratung" variant="ink" size="sm" className="hidden md:inline-flex">
            Kostenlose Beratung
          </ButtonLink>
          <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogPrimitive.Trigger
              className="btn btn-ghost size-11 rounded-full p-0 lg:hidden"
              aria-label="Menü öffnen"
            >
              <Icon icon={Menu} size={24} />
            </DialogPrimitive.Trigger>
            <SheetContent
              title="Menü"
              footer={
                <ButtonLink href="/beratung" variant="primary" block onClick={() => setMobileOpen(false)}>
                  Kostenlose Beratung
                </ButtonLink>
              }
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex h-12 w-full items-center gap-3 rounded-full border border-line-strong px-4 type-body text-text-subtle"
              >
                <Icon icon={Search} size={20} />
                Software, Kategorie oder Anbieter suchen
              </button>
              <nav aria-label="Mobile Navigation" className="mt-4">
                <AccordionPrimitive.Root type="single" collapsible>
                  <AccordionPrimitive.Item value="kategorien" className="border-b border-line">
                    <AccordionPrimitive.Header>
                      <AccordionPrimitive.Trigger className="group flex min-h-14 w-full items-center justify-between text-left type-h4 text-ink">
                        Kategorien
                        <Icon
                          icon={ChevronDown}
                          size={20}
                          className="transition-transform group-data-[state=open]:rotate-180"
                        />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <ul className="pb-3">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <AppLink
                              href={categoryHref(category.slug)}
                              onClick={() => setMobileOpen(false)}
                              className="flex min-h-12 items-center gap-3 type-label text-ink"
                            >
                              <Icon icon={category.icon} size={20} className="text-text-muted" />
                              {category.name}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                </AccordionPrimitive.Root>
                <ul>
                  {mainNav.map((item) => (
                    <li key={item.href} className="border-b border-line">
                      <AppLink
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex min-h-14 items-center justify-between type-h4 text-ink"
                      >
                        {item.label}
                        <Icon icon={ArrowRight} size={20} className="text-text-muted" />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </DialogPrimitive.Root>
        </div>
      </div>
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} items={searchItems} />
    </header>
  );
}
