import { requestDownload } from "@/app/actions/forms";
import { DownloadForm } from "@/components/forms/download-form";
import { ButtonLink } from "@/components/ui/button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideCover } from "@/components/content/guide-cover";
import { Mdx } from "@/components/content/mdx";
import { DraftNotice, PageHeader } from "@/components/content/page-parts";
import { getDownload, listDownloads } from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listDownloads().map((d) => d.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/leitfaeden/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const download = getDownload(slug);
  if (!download) return {};
  return pageMetadata({
    title: download.title,
    description: download.description,
    path: routes.download(download.slug),
  });
}

/** Download page (Section 13.7): gated guides arrive by double opt in email. */
export default async function DownloadPage({ params }: PageProps<"/leitfaeden/[slug]">) {
  const { slug } = await params;
  const download = getDownload(slug);
  if (!download) notFound();
  return (
    <>
      <DraftNotice status={download.status} what="Dieser Leitfaden" />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Leitfäden", href: routes.downloads() },
          { label: download.title, href: routes.download(download.slug) },
        ]}
        title={download.title}
        lead={download.description}
        meta={<>{formatNumber(download.pages)} Seiten · PDF</>}
      />
      <div className="container-content grid gap-10 pb-20 md:grid-cols-[18rem_1fr]">
        <GuideCover stickers={download.stickers} seed={download.slug} />
        <div className="flex flex-col gap-6">
          <section aria-labelledby="kapitel">
            <h2 id="kapitel" className="type-h3 text-ink">
              Das erwartet Sie
            </h2>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 type-body text-ink">
              {download.chapters.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </section>
          <Mdx code={download.mdx} />
          <section aria-labelledby="anfordern" className="flex flex-col gap-4">
            <h2 id="anfordern" className="type-h3 text-ink">
              Leitfaden kostenlos erhalten
            </h2>
            {download.gated ? (
              <DownloadForm slug={download.slug} action={requestDownload} />
            ) : (
              <ButtonLink href={download.file} icon="none" className="self-start" download>
                PDF herunterladen
              </ButtonLink>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
