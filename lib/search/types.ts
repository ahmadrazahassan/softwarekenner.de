/** Shared search types; kept free of Fuse.js so client components can import them. */
export type SearchGroup = "Software" | "Kategorien" | "Vergleiche" | "Ratgeber";
export const SEARCH_GROUPS: SearchGroup[] = ["Software", "Kategorien", "Vergleiche", "Ratgeber"];

export type SearchItem = {
  id: string;
  group: SearchGroup;
  label: string;
  hint?: string;
  href: string;
  /** Extra terms that should find the item (vendor, short names, integrations). */
  keywords?: string[];
};
