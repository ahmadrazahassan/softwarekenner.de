/**
 * Cache Components needs at least one entry from every generateStaticParams. While a collection
 * is empty (for example before the first guide is published) we return a placeholder that the
 * page answers with notFound(), as the Next.js docs recommend for this case.
 */
export const PLACEHOLDER_PARAM = "__platzhalter__";

export function staticParams<K extends string>(key: K, values: string[]): Record<K, string>[] {
  const list = values.length ? values : [PLACEHOLDER_PARAM];
  return list.map((value) => ({ [key]: value }) as Record<K, string>);
}
