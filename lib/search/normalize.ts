/**
 * Umlaut aware normalization (Section 17): "Größe" and "groesse" match in both directions.
 * Applied to the query and to every indexed string.
 */
export function normalizeDe(input: string): string {
  return input
    .toLocaleLowerCase("de")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** True when every word of the query occurs in the text (both normalized). */
export function matchesDe(text: string, query: string): boolean {
  const haystack = normalizeDe(text);
  return normalizeDe(query)
    .split(" ")
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
