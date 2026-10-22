import { CircleAlert, FilePenLine } from "lucide-react";
import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

/** Emits JSON-LD when a builder returned data (builders return null until the domain is set). */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Breadcrumb, eyebrow, H1, lead and optional byline in the house layout. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lead,
  meta,
  aside,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-content pt-8 pb-10 lg:pt-10 lg:pb-14", className)}>
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-4xl flex-col gap-4">
          {eyebrow && <p className="type-eyebrow text-brand-ink">{eyebrow}</p>}
          <h1 className="type-h1 text-ink">{title}</h1>
          {lead && <div className="measure type-lead text-text-muted">{lead}</div>}
          {meta && <div className="type-small text-text-muted">{meta}</div>}
        </div>
        {aside && <div className="flex-none">{aside}</div>}
      </div>
    </header>
  );
}

/** Visible only in preview builds: marks unpublished drafts so nobody mistakes them for live content. */
export function DraftNotice({
  status,
  what = "Diese Seite",
}: {
  status: "entwurf" | "veroeffentlicht";
  what?: string;
}) {
  if (status !== "entwurf") return null;
  return (
    <div role="note" className="border-b border-brand-200 bg-brand-50">
      <p className="container-content flex items-center gap-2 py-2.5 type-small text-ink">
        <Icon icon={FilePenLine} size={16} className="flex-none text-brand-ink" />
        <span>
          <strong>Vorschau.</strong> {what} ist ein Entwurf und noch nicht veröffentlicht. Wertungen und Texte
          warten auf die redaktionelle Prüfung.
        </span>
      </p>
    </div>
  );
}

/** Visible internal note for the legal pages (Section 13.13). */
/** Internal note for the editor; only rendered in the local preview, never on the public site. */
export function LegalReviewNote() {
  if (process.env.CONTENT_PREVIEW !== "1") return null;
  return (
    <div role="note" className="flex gap-3 rounded-md border border-negative/30 bg-white p-4">
      <Icon icon={CircleAlert} size={20} className="mt-0.5 flex-none text-negative" />
      <p className="type-small text-ink">
        <strong>Interner Hinweis:</strong> Struktur und Platzhalter. Alle rechtlichen Texte müssen vor dem
        Start von einer Rechtsanwältin oder einem Rechtsanwalt geprüft werden. Platzhalter in geschweiften
        Klammern werden in site.config.ts ergänzt.
      </p>
    </div>
  );
}

/** Section with the house rhythm and an optional heading block. */
export function PageSection({
  id,
  children,
  tone = "canvas",
  className,
}: {
  id?: string;
  children: ReactNode;
  tone?: "canvas" | "white" | "ink";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-14 lg:py-20",
        tone === "white" && "bg-white",
        tone === "ink" && "text-white bg-ink-glow",
        className,
      )}
    >
      <div className="container-content">{children}</div>
    </section>
  );
}
