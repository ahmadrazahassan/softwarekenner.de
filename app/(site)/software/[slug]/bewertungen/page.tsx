import { PenLine } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DraftNotice, PageHeader } from "@/components/content/page-parts";
import { ReviewCard } from "@/components/review/review-card";
import { ScoreCard } from "@/components/software/data-display";
import { ReviewTransparency } from "@/components/software/profile-parts";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { getCategory, getScore, getSoftware, getVendor, listSoftware, listUserReviews } from "@/lib/content";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listSoftware().map((s) => s.slug),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/software/[slug]/bewertungen">): Promise<Metadata> {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) return {};
  return pageMetadata({
    title: `${software.name}: Erfahrungen und Nutzerbewertungen`,
    description: `Verifizierte Nutzerbewertungen zu ${software.name}. Wie wir Bewertungen prüfen und warum wir keine Kritik löschen.`,
    path: routes.softwareReviews(software.slug),
    // Thin until real reviews exist (Section 20).
    noindex: listUserReviews(software.slug).length === 0,
  });
}

export default async function ReviewsPage({ params }: PageProps<"/software/[slug]/bewertungen">) {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) notFound();
  const category = getCategory(software.primaryCategory);
  const vendor = getVendor(software.vendor);
  const reviews = listUserReviews(software.slug);
  const distribution = [5, 4, 3, 2, 1].map(
    (stars) => reviews.filter((r) => r.ratings.overall === stars).length,
  ) as [number, number, number, number, number];
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length
    : 0;

  return (
    <>
      <DraftNotice status={software.status} what="Dieses Profil" />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          ...(category ? [{ label: category.shortName, href: routes.category(category.slug) }] : []),
          { label: software.name, href: routes.software(software.slug) },
          { label: "Bewertungen", href: routes.softwareReviews(software.slug) },
        ]}
        title={`${software.name}: Erfahrungen von Nutzerinnen und Nutzern`}
        lead="Wir veröffentlichen nur Bewertungen, deren Verfasserinnen und Verfasser wir verifiziert haben. Nutzerbewertungen fließen nicht in die Redaktionswertung ein."
      />
      <div className="container-content grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          {reviews.length === 0 ? (
            <EmptyState
              seed={`${software.slug}-bewertungen`}
              icon={PenLine}
              title={`Wie bewährt sich ${software.name} in Ihrem Unternehmen?`}
              text="Wir veröffentlichen ausschließlich verifizierte Erfahrungen aus Unternehmen. Ihre Bewertung hilft anderen bei der Entscheidung und fließt getrennt von der Redaktionswertung ein."
              action={
                <ButtonLink href={routes.writeReview()} variant="ink">
                  Bewertung schreiben
                </ButtonLink>
              }
            />
          ) : (
            reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={{
                  id: r.id,
                  displayName: r.author.displayName,
                  role: r.author.role,
                  companySize: COMPANY_SIZE_LABEL[r.author.companySize],
                  date: r.createdAt,
                  rating: r.ratings.overall,
                  verified: true,
                  incentivized: r.incentivized,
                  title: r.title,
                  body: r.body,
                  strengths: r.strengths,
                  weaknesses: r.weaknesses,
                  helpfulCount: r.helpfulCount,
                  vendorReply: r.vendorReply
                    ? {
                        vendorName: vendor?.brandName ?? software.name,
                        date: r.vendorReply.date,
                        text: r.vendorReply.text,
                      }
                    : undefined,
                }}
              />
            ))
          )}
          <ReviewTransparency />
        </div>
        <ScoreCard
          className="self-start"
          score={getScore(software.slug) ?? 0}
          methodHref={routes.methodology()}
          userRatings={reviews.length ? { average, count: reviews.length, distribution } : null}
        />
      </div>
    </>
  );
}
