import { ChevronRight } from "lucide-react";

import { AppLink } from "@/components/ui/app-link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import { isPlaceholder, siteConfig } from "@/site.config";

export type Crumb = { label: string; href: string };

/** BreadcrumbList JSON-LD. Needs absolute URLs, so it is emitted once the domain is set. */
function breadcrumbJsonLd(items: Crumb[]) {
  if (isPlaceholder(siteConfig.domain)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteConfig.domain).toString(),
    })),
  };
}

/** Breadcrumbs (Section 7.1): Work Sans 500, 14 px, chevron separators, last item muted. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const jsonLd = breadcrumbJsonLd(items);
  return (
    <nav aria-label="Brotkrumen" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1 font-ui text-small font-medium">
              {last ? (
                <span aria-current="page" className="text-text-muted">
                  {item.label}
                </span>
              ) : (
                <>
                  <AppLink
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-8 items-center text-ink underline-offset-4 hover:underline",
                    )}
                  >
                    {item.label}
                  </AppLink>
                  <Icon icon={ChevronRight} size={16} className="text-text-subtle" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
    </nav>
  );
}
