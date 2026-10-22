"use client";

import { X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

export const MAX_COMPARE = 4;

type CompareItem = { slug: string; name: string; logo?: string | null };
type CompareState = {
  items: CompareItem[];
  toggle: (item: CompareItem) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareState | null>(null);

/* Session store: the selection survives reloads and page changes in this tab. Product data only. */
const STORAGE_KEY = "vergleichsauswahl";
const EMPTY: CompareItem[] = [];
const listeners = new Set<() => void>();
let cache: CompareItem[] | null = null;

const isItem = (v: unknown): v is CompareItem =>
  !!v &&
  typeof v === "object" &&
  typeof (v as CompareItem).slug === "string" &&
  typeof (v as CompareItem).name === "string";

function readStore(): CompareItem[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter(isItem).slice(0, MAX_COMPARE) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function writeStore(items: CompareItem[]) {
  cache = items;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map(({ slug, name, logo }) => ({ slug, name, logo }))),
    );
  } catch {
    // Storage blocked (private mode): the selection still works for this page view.
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const toggled = (current: CompareItem[], item: CompareItem) =>
  current.some((i) => i.slug === item.slug)
    ? current.filter((i) => i.slug !== item.slug)
    : current.length >= MAX_COMPARE
      ? current
      : [...current, item];

/**
 * Selection for the compare tray (Section 7.4). The site keeps it in sessionStorage (`persist`),
 * so it survives navigation and reloads; the styleguide keeps it in local state.
 */
export function CompareProvider({
  children,
  initial = EMPTY,
  persist = false,
}: {
  children: ReactNode;
  initial?: CompareItem[];
  persist?: boolean;
}) {
  const [local, setLocal] = useState<CompareItem[]>(initial);
  const stored = useSyncExternalStore(subscribe, readStore, () => EMPTY);
  const items = persist ? stored : local;
  const toggle = (item: CompareItem) =>
    persist ? writeStore(toggled(readStore(), item)) : setLocal((current) => toggled(current, item));
  const clear = () => (persist ? writeStore(EMPTY) : setLocal(EMPTY));
  return <CompareContext value={{ items, toggle, clear }}>{children}</CompareContext>;
}

function useCompare() {
  const state = useContext(CompareContext);
  if (!state) throw new Error("CompareProvider fehlt.");
  return state;
}

export function CompareCheckbox({ item }: { item: CompareItem }) {
  const { items, toggle } = useCompare();
  const checked = items.some((i) => i.slug === item.slug);
  const full = items.length >= MAX_COMPARE && !checked;
  return (
    <Checkbox
      label="Vergleichen"
      description={full ? `Maximal ${MAX_COMPARE} Programme` : undefined}
      checked={checked}
      disabled={full}
      onCheckedChange={() => toggle(item)}
      aria-label={`${item.name} vergleichen`}
    />
  );
}

/** Sticky bottom bar once two products are selected (Section 7.4). */
export function CompareTray({ onCompare }: { onCompare?: (slugs: string[]) => void }) {
  const { items, toggle, clear } = useCompare();
  const router = useRouter();
  const compare = (slugs: string[]) =>
    onCompare ? onCompare(slugs) : router.push(routes.compareTool(slugs) as Route);
  const visible = items.length >= 2;

  return (
    <div
      role="region"
      aria-label="Vergleichsauswahl"
      hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-lg backdrop-blur",
        visible && "animate-sheet-in-bottom",
      )}
    >
      <div className="container-content flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <p className="type-label text-ink" aria-live="polite">
          <span className="font-semibold">{items.length}</span> von {MAX_COMPARE} ausgewählt
        </p>
        <ul className="flex items-center gap-2">
          {items.map((item) => (
            <li key={item.slug} className="relative">
              <LogoTile name={item.name} logo={item.logo} size={40} />
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-label={`${item.name} aus dem Vergleich entfernen`}
                className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-line-strong bg-white text-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-ink"
              >
                <Icon icon={X} size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-4">
          <button type="button" onClick={clear} className="link-cta min-h-11 text-small">
            Auswahl leeren
          </button>
          <Button size="sm" onClick={() => compare(items.map((i) => i.slug))}>
            Jetzt vergleichen
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Outline button that adds a product to the comparison (profile header). */
export function AddToCompareButton({ item }: { item: CompareItem }) {
  const { items, toggle } = useCompare();
  const selected = items.some((i) => i.slug === item.slug);
  const full = items.length >= MAX_COMPARE && !selected;
  return (
    <Button
      variant="outline"
      icon="none"
      aria-pressed={selected}
      disabled={full}
      onClick={() => toggle(item)}
    >
      {selected ? "Im Vergleich" : "Zum Vergleich hinzufügen"}
    </Button>
  );
}
