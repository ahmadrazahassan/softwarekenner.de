"use client";

import { Command } from "cmdk";
import { ArrowLeftRight, BookOpen, CornerDownLeft, Search, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Spinner } from "@/components/ui/spinner";

import { Icon } from "@/components/ui/icon";
import { CATEGORIES } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import { matchesDe } from "@/lib/search/normalize";
import { cn } from "@/lib/utils/cn";

import { SEARCH_GROUPS, type SearchGroup, type SearchItem } from "@/lib/search/types";

export type { SearchGroup, SearchItem };

/** Icons are looked up here: components cannot be passed from server to client as props. */
const GROUP_ICON: Partial<Record<SearchGroup, LucideIcon>> = {
  Vergleiche: ArrowLeftRight,
  Ratgeber: BookOpen,
};
const iconFor = (item: SearchItem): LucideIcon | undefined =>
  item.group === "Kategorien"
    ? CATEGORIES.find((c) => c.slug === item.id.replace(/^kategorie:/, ""))?.icon
    : GROUP_ICON[item.group];

const GROUPS = SEARCH_GROUPS;

const subscribeNoop = () => () => {};
/** "⌘ K" on macOS, "Strg K" on Windows and Linux (Section 17). Server render uses "Strg K". */
export function useShortcutLabel() {
  return useSyncExternalStore(
    subscribeNoop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Strg K"),
    () => "Strg K",
  );
}

/** Opens on Strg K or ⌘ K anywhere on the page. */
export function useCommandShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}

/** "idle" while enabled means loading. */
type IndexState = { status: "idle" | "error" } | { status: "ready"; items: SearchItem[] };

/** Loads public/search-index.json (written at build time) once, on first open. */
function useSearchIndex(enabled: boolean): IndexState {
  const [state, setState] = useState<IndexState>({ status: "idle" });
  const shouldLoad = enabled && state.status === "idle";
  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => (res.ok ? (res.json() as Promise<{ items: SearchItem[] }>) : Promise.reject(res)))
      .then((data) => !cancelled && setState({ status: "ready", items: data.items }))
      .catch(() => !cancelled && setState({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);
  return state;
}

/**
 * Command palette search (Section 7.4) on cmdk. Umlaut aware: "Größe" finds "groesse".
 * Items come from the build time search index, fetched on first open so pages do not carry them.
 * The styleguide passes demo items directly.
 */
export function CommandPalette({
  open,
  onOpenChange,
  items: givenItems,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: SearchItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const index = useSearchIndex(open && !givenItems);
  const items = givenItems ?? (index.status === "ready" ? index.items : []);
  const loading = !givenItems && index.status === "idle";
  const failed = !givenItems && index.status === "error";
  const openResultsPage = () => {
    onOpenChange(false);
    router.push(`${routes.search()}?q=${encodeURIComponent(query.trim())}` as never);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content className="fixed top-[12vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-white shadow-lg data-[state=open]:animate-pop-in">
          <DialogPrimitive.Title className="sr-only">Suche</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Software, Kategorien, Vergleiche und Ratgeber durchsuchen. Mit den Pfeiltasten auswählen, mit
            Enter öffnen.
          </DialogPrimitive.Description>
          <Command
            label="Suche"
            filter={(value, search, keywords) =>
              matchesDe([value, ...(keywords ?? [])].join(" "), search) ? 1 : 0
            }
            className="flex max-h-[70vh] flex-col"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Icon icon={Search} size={20} className="flex-none text-text-muted" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                onKeyDown={(event) => {
                  // Without the index, Enter falls back to the server rendered results page.
                  if (failed && event.key === "Enter") openResultsPage();
                }}
                placeholder="Software, Kategorie oder Anbieter suchen"
                className="h-16 w-full bg-transparent font-body text-body-lg text-ink outline-none placeholder:text-text-subtle"
              />
              <kbd className="flex-none rounded-xs border border-line px-1.5 py-1 type-micro text-text-muted normal-case">
                Esc
              </kbd>
            </div>
            <Command.List className="flex-1 overflow-y-auto p-2">
              {loading && (
                <Command.Loading>
                  <p className="flex items-center justify-center gap-2 px-4 py-10 type-body text-text-muted">
                    <Spinner /> Suche wird geladen
                  </p>
                </Command.Loading>
              )}
              {failed && (
                <p role="alert" className="px-4 py-10 text-center type-body text-text-muted">
                  Die Schnellsuche ist gerade nicht verfügbar. Drücken Sie Enter, um die Suchseite zu öffnen.
                </p>
              )}
              {!loading && !failed && (
                <Command.Empty className="px-4 py-10 text-center type-body text-text-muted">
                  Keine Treffer für „{query}“. Versuchen Sie einen allgemeineren Begriff oder stöbern Sie in
                  den Kategorien.
                </Command.Empty>
              )}
              {GROUPS.map((group) => {
                const groupItems = items.filter((item) => item.group === group);
                if (groupItems.length === 0) return null;
                return (
                  <Command.Group
                    key={group}
                    heading={group}
                    className="py-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:type-micro [&_[cmdk-group-heading]]:text-text-muted"
                  >
                    {groupItems.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.label} ${item.id}`}
                        keywords={item.hint ? [item.hint] : undefined}
                        onSelect={() => {
                          onOpenChange(false);
                          router.push(item.href as never);
                        }}
                        className={cn(
                          "group flex min-h-12 cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-ink",
                          "data-[selected=true]:bg-surface-tint",
                        )}
                      >
                        {iconFor(item) && (
                          <Icon icon={iconFor(item)!} size={20} className="flex-none text-text-muted" />
                        )}
                        <span className="flex-1 type-label">{item.label}</span>
                        {item.hint && <span className="type-small text-text-muted">{item.hint}</span>}
                        <Icon
                          icon={CornerDownLeft}
                          size={16}
                          className="flex-none text-text-muted opacity-0 group-data-[selected=true]:opacity-100"
                        />
                      </Command.Item>
                    ))}
                  </Command.Group>
                );
              })}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
