import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/content/page-parts";
import { SoftwareCard } from "@/components/software/cards";
import { getAuthor, listAuthors, listSoftware, summaryOf } from "@/lib/content";
import { initials } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { staticParams } from "@/lib/static-params";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listAuthors().map((a) => a.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/autoren/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return pageMetadata({
    title: author.name,
    description: author.bio.slice(0, 155),
    path: routes.author(author.slug),
  });
}

export default async function AuthorPage({ params }: PageProps<"/autoren/[slug]">) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const written = listSoftware().filter((s) => s.editorial.author === author.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Redaktion", href: routes.editorialTeam() },
          { label: author.name, href: routes.author(author.slug) },
        ]}
        eyebrow={author.role}
        title={author.name}
        lead={author.bio}
        aside={
          <span
            aria-hidden="true"
            className="flex size-24 items-center justify-center rounded-full bg-line font-display text-h3 font-bold text-ink"
          >
            {initials(author.name)}
          </span>
        }
      />
      <div className="container-content flex flex-col gap-6 pb-20">
        {author.expertise.length > 0 && (
          <p className="type-label text-text-muted">Schwerpunkte: {author.expertise.join(", ")}</p>
        )}
        {written.length > 0 && (
          <section aria-labelledby="bewertungen">
            <h2 id="bewertungen" className="mb-6 type-h3 text-ink">
              Bewertungen von {author.name}
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-5">
              {written.map((s) => (
                <li key={s.slug}>
                  <SoftwareCard software={summaryOf(s, { from: "profil" })} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
