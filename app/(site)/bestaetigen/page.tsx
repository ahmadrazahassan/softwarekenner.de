import { CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { confirmToken } from "@/app/actions/forms";
import { PageHeader } from "@/components/content/page-parts";
import { ConfirmPanel } from "@/components/forms/confirm-panel";
import { ButtonLink } from "@/components/ui/button";
import { Notice, Skeleton } from "@/components/ui/feedback";
import { openToken } from "@/lib/forms/tokens";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bestätigung",
  description: "Bestätigen Sie Ihre E-Mail-Adresse.",
  path: "/bestaetigen",
  noindex: true,
});

const TEXT = {
  newsletter: "Bitte bestätigen Sie Ihre Anmeldung zum Newsletter.",
  download: "Bitte bestätigen Sie Ihre E-Mail-Adresse. Danach können Sie den Leitfaden herunterladen.",
  review: "Bitte bestätigen Sie Ihre geschäftliche E-Mail-Adresse. Danach prüfen wir Ihre Bewertung.",
} as const;

async function Confirmation({ searchParams }: { searchParams: PageProps<"/bestaetigen">["searchParams"] }) {
  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] : token;
  const payload = value ? openToken(value) : null;
  if (!value || !payload) {
    return (
      <div className="flex flex-col gap-5">
        <Notice tone="negative" icon={CircleAlert} title="Dieser Link funktioniert nicht mehr">
          Bestätigungslinks sind sieben Tage gültig. Bitte senden Sie das Formular erneut ab.
        </Notice>
        <ButtonLink href={routes.home()} variant="outline" className="self-start">
          Zur Startseite
        </ButtonLink>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <p className="type-body-lg text-ink">{TEXT[payload.p]}</p>
      <ConfirmPanel token={value} purpose={payload.p} action={confirmToken} />
    </div>
  );
}

/** Double opt in landing page. Opening it changes nothing; the button confirms (Section 19). */
export default function ConfirmPage({ searchParams }: PageProps<"/bestaetigen">) {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Bestätigung", href: "/bestaetigen" },
        ]}
        title="Bestätigung"
      />
      <div className="container-reading pb-20">
        <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
          <Confirmation searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
