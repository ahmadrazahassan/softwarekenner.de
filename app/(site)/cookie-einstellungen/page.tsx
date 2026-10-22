import { ConsentChoices } from "@/components/consent/consent";
import { consentRequired } from "@/lib/consent";
import type { Metadata } from "next";

import { LegalReviewNote } from "@/components/content/page-parts";
import { TextPage } from "@/components/content/text-page";
import { AppLink } from "@/components/ui/app-link";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cookie-Einstellungen",
  description: "Welche Cookies und Dienste wir einsetzen und wie Sie Ihre Einwilligung verwalten.",
  path: routes.legal.cookies(),
});

/** Section 19: without consent requiring services there is no banner, but this page stays. */
export default function CookieSettingsPage() {
  const consentNeeded = consentRequired();
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Cookie-Einstellungen", href: routes.legal.cookies() },
      ]}
      title="Cookie-Einstellungen"
      before={<LegalReviewNote />}
    >
      {consentNeeded ? (
        <>
          <p>
            Hier verwalten Sie Ihre Einwilligungen. Ihre Auswahl können Sie jederzeit ändern oder widerrufen.
          </p>
          <div className="not-prose rounded-lg border border-line bg-white p-6">
            <ConsentChoices />
          </div>
        </>
      ) : (
        <>
          <p>
            Wir setzen derzeit keine Cookies und keine Dienste ein, für die wir Ihre Einwilligung brauchen.
            Deshalb zeigen wir kein Cookie-Banner.
          </p>
          <p>
            Sobald wir einen einwilligungspflichtigen Dienst einsetzen, können Sie Ihre Auswahl hier jederzeit
            ändern. Details stehen in der{" "}
            <AppLink href={routes.legal.privacy()}>Datenschutzerklärung</AppLink>.
          </p>
        </>
      )}
    </TextPage>
  );
}
