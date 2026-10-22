"use client";

import { SlidersHorizontal } from "lucide-react";
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { createContext, Suspense, useContext, useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { LocalVendorToggle } from "@/components/ui/form";
import {
  FILTER_KEYS,
  matchesFilters,
  toFilters,
  type Facets,
  type FilterGroupDef,
  type FilterSelection,
} from "@/lib/content/filters";
import { formatNumber } from "@/lib/format";

import { FilterBar } from "./filter-bar";

const list = parseAsArrayOf(parseAsString).withDefault([]);
const PARSERS = {
  preis: list,
  groesse: list,
  bereitstellung: list,
  server: list,
  compliance: list,
  schnittstellen: list,
  testphase: list,
  kostenlos: list,
  wertung: list,
  de: parseAsBoolean.withDefault(false),
};
type UrlState = { [K in keyof typeof PARSERS]: K extends "de" ? boolean : string[] };
type Bridge = { state: UrlState; set: (next: Partial<UrlState> | null) => void };

type FilterContextValue = {
  groups: FilterGroupDef[];
  selection: FilterSelection;
  onlyGerman: boolean;
  /** False until the URL has been read after hydration. */
  ready: boolean;
  visible: Set<string>;
  total: number;
  update: (selection: FilterSelection, onlyGerman: boolean) => void;
  reset: () => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

function useFilters() {
  const value = useContext(FilterContext);
  if (!value) throw new Error("FilterScope fehlt.");
  return value;
}

/**
 * Reads and writes the filter state in the URL with nuqs (product attributes only). It sits in its own
 * Suspense boundary, so the server rendered list never waits for the URL: before hydration every
 * product is visible, which is also what search engines see.
 */
function UrlSync({ onChange }: { onChange: (bridge: Bridge) => void }) {
  const [state, set] = useQueryStates(PARSERS, { history: "replace", scroll: false });
  useEffect(() => onChange({ state, set: (next) => void set(next) }), [state, set, onChange]);
  return null;
}

/**
 * Wraps the server rendered ranking. Items stay in editorial order; filtering only hides them
 * (Section 18: ranking order is always the editorial score).
 */
export function FilterScope({
  facets,
  groups,
  children,
}: {
  facets: Facets[];
  groups: FilterGroupDef[];
  children: ReactNode;
}) {
  const [bridge, setBridge] = useState<Bridge | null>(null);
  const state = bridge?.state;
  const selection: FilterSelection = Object.fromEntries(FILTER_KEYS.map((k) => [k, state?.[k] ?? []]));
  const onlyGerman = state?.de ?? false;
  const filters = toFilters(selection, onlyGerman);
  const visible = new Set(facets.filter((f) => matchesFilters(f, filters)).map((f) => f.slug));

  const update = (next: FilterSelection, german: boolean) =>
    bridge?.set({
      ...Object.fromEntries(FILTER_KEYS.map((k) => [k, next[k]?.length ? next[k] : null])),
      de: german || null,
    } as Partial<UrlState>);

  return (
    <FilterContext
      value={{
        groups,
        selection,
        onlyGerman,
        ready: bridge !== null,
        visible,
        total: facets.length,
        update,
        reset: () => bridge?.set(null),
      }}
    >
      <Suspense fallback={null}>
        <UrlSync onChange={setBridge} />
      </Suspense>
      {children}
    </FilterContext>
  );
}

export function FilterControls() {
  const { groups, selection, onlyGerman, visible, update, ready } = useFilters();
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <FilterBar
        groups={groups}
        value={selection}
        onChange={(next) => update(next, onlyGerman)}
        resultCount={visible.size}
        className="min-w-0 flex-1"
      />
      <LocalVendorToggle
        checked={onlyGerman}
        disabled={!ready}
        onCheckedChange={(checked) => update(selection, checked)}
        className="flex-none"
      />
    </div>
  );
}

/** One ranked entry; hidden while it does not match the filters. */
export function FilterItem({ slug, children }: { slug: string; children: ReactNode }) {
  const { visible } = useFilters();
  return <li hidden={!visible.has(slug)}>{children}</li>;
}

/** "9 Programme" or, while filtered, "3 von 9 Programmen". */
export function FilterCount() {
  const { visible, total } = useFilters();
  if (visible.size === total) return <>{formatNumber(total)} Programme</>;
  return (
    <>
      {formatNumber(visible.size)} von {formatNumber(total)} Programmen
    </>
  );
}

export function FilterEmpty() {
  const { visible, reset } = useFilters();
  if (visible.size > 0) return null;
  return (
    <EmptyState
      icon={SlidersHorizontal}
      title="Kein Programm erfüllt alle Filter"
      text="Lockern Sie einen Filter, zum Beispiel den Preis oder die Compliance-Anforderungen."
      action={
        <Button variant="outline" icon="none" onClick={reset}>
          Filter zurücksetzen
        </Button>
      }
    />
  );
}
