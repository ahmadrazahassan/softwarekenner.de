import type { Route } from "next";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export type AppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  /** Opens in a new tab and announces it to screen readers. */
  external?: boolean;
};

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

/**
 * Internal links go through next/link, external ones are plain anchors.
 * Components accept plain strings while the page routes are still being built; page level
 * links use the typed route helpers from Phase 3 (docs/DECISIONS.md).
 */
export function AppLink({ href, external, children, rel, ...props }: AppLinkProps) {
  if (external || isExternal(href)) {
    return (
      <a href={href} target="_blank" rel={rel ?? "noopener"} {...props}>
        {children}
        <span className="sr-only"> (öffnet in neuem Tab)</span>
      </a>
    );
  }
  return (
    <Link href={href as Route} rel={rel} {...props}>
      {children}
    </Link>
  );
}
