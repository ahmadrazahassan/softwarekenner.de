import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/content/mdx";
import { DraftNotice, PageHeader } from "@/components/content/page-parts";
import { AppLink } from "@/components/ui/app-link";
import { getAuthor, getGuide, listGuides } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listGuides().map((g) => g.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/ratgeber/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.title, description: guide.description, path: routes.guide(guide.slug) });
}

export default async function GuidePage({ params }: PageProps<"/ratgeber/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const author = getAuthor(guide.author);
  const reviewer = getAuthor(guide.reviewer);

  return (
    <>
      <DraftNotice status={guide.status} what="Dieser Ratgeber" />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Ratgeber", href: routes.guides() },
          { label: guide.title, href: routes.guide(guide.slug) },
        ]}
        eyebrow={guide.topic}
        title={guide.title}
        lead={guide.description}
        meta={
          <>
            {author && (
              <>
                Von{" "}
                <AppLink href={routes.author(author.slug)} className="font-semibold text-ink hover:underline">
                  {author.name}
                </AppLink>{" "}
                ·{" "}
              </>
            )}
            {reviewer && <>Fachlich geprüft von {reviewer.name} · </>}
            Zuletzt aktualisiert am {formatDate(guide.updatedAt)}
          </>
        }
      />
      <div className="container-reading flex flex-col gap-10 pb-20">
        {guide.hero && (
          <Image
            src={guide.hero.src}
            alt={guide.hero.alt}
            width={1440}
            height={810}
            className="rounded-xl"
            priority
            sizes="(min-width: 768px) 720px, 100vw"
          />
        )}
        <Mdx code={guide.mdx} />
        <section aria-labelledby="quellen" className="border-t border-line pt-8">
          <h2 id="quellen" className="type-h4 text-ink">
            Quellen
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 type-small text-text-muted">
            {guide.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener" className="link-inline">
                  {s.label}
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
                , abgerufen am {formatDate(s.accessedAt)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
