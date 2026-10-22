import type { Metadata } from "next";

import { ChartFrame, WeightsDonut } from "@/components/charts";
import { PageHeader } from "@/components/content/page-parts";
import { AWARD_REASON } from "@/components/software/award-card";
import { AWARD_LABEL } from "@/components/ui/award-seal";
import { formatPercent } from "@/lib/format";
import { routes } from "@/lib/routes";
import { CRITERIA, CRITERION_LABEL, DEFAULT_WEIGHTS, type AwardKind } from "@/lib/scoring";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "So bewerten wir: unsere Methodik",
  description:
    "Kriterien, Gewichtung, Bewertungsskala, Auszeichnungen und unser Umgang mit Provisionen und Nutzerbewertungen.",
  path: routes.methodology(),
});

const DEFINITIONS: Record<(typeof CRITERIA)[number], string> = {
  funktionsumfang:
    "Wie vollständig deckt die Software die typischen Aufgaben ihrer Kategorie ab, gemessen an den Abläufen deutscher Unternehmen.",
  bedienung:
    "Wie schnell finden sich neue Nutzerinnen und Nutzer zurecht, wie aufwendig sind Einrichtung und Umstieg.",
  preisLeistung: "Was kostet die Software für typische Unternehmensgrößen, und was ist im Preis enthalten.",
  datenschutz: "Serverstandort, Auftragsverarbeitung, GoBD, E-Rechnung und nachgewiesene Zertifizierungen.",
  support: "Erreichbarkeit, Sprache und Kanäle des Supports, Hilfecenter und Schulungen.",
  integrationen: "Schnittstellen zu DATEV, ELSTER, Banken, Shops und anderen verbreiteten Systemen.",
};

const SCALE: [string, string][] = [
  ["4,5 bis 5,0", "Hervorragend"],
  ["4,0 bis 4,4", "Sehr gut"],
  ["3,5 bis 3,9", "Gut"],
  ["3,0 bis 3,4", "Befriedigend"],
  ["2,0 bis 2,9", "Ausreichend"],
  ["unter 2,0", "Mangelhaft"],
];

const TOP3 = [...CRITERIA].sort((a, b) => DEFAULT_WEIGHTS[b] - DEFAULT_WEIGHTS[a]).slice(0, 3);

const AWARDS: AwardKind[] = ["redaktion", "preisLeistung", "selbststaendige", "mittelstand", "datenschutz"];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Methodik", href: routes.methodology() },
        ]}
        title="So bewerten wir"
        lead="Jede Software erhält eine Redaktionswertung von 0 bis 5. Sie setzt sich aus sechs Kriterien mit öffentlicher Gewichtung zusammen. Provisionen und bezahlte Platzierungen haben darauf keinen Einfluss."
      />
      <div className="prose-brand container-reading pb-20">
        <h2>Kriterien und Gewichtung</h2>
        <ChartFrame
          title="Die Gewichtung als Diagramm"
          takeaway={`${TOP3.map((c) => CRITERION_LABEL[c])
            .join(", ")
            .replace(
              /, ([^,]+)$/,
              " und $1",
            )} machen zusammen ${formatPercent(TOP3.reduce((n, c) => n + DEFAULT_WEIGHTS[c], 0) * 100)} der Wertung aus.`}
          summary={`Ringdiagramm der Gewichtung: ${CRITERIA.map((c) => `${CRITERION_LABEL[c]} ${formatPercent(DEFAULT_WEIGHTS[c] * 100)}`).join(", ")}.`}
          footnote="Standardgewichtung für alle Kategorien ohne eigene Gewichtung."
          table={{
            columns: ["Kriterium", "Gewichtung"],
            rows: CRITERIA.map((c) => [CRITERION_LABEL[c], formatPercent(DEFAULT_WEIGHTS[c] * 100)]),
          }}
          height={260}
          className="not-prose my-8 rounded-lg border border-line bg-white p-6"
        >
          <WeightsDonut
            data={CRITERIA.map((c) => ({ label: CRITERION_LABEL[c], percent: DEFAULT_WEIGHTS[c] * 100 }))}
          />
        </ChartFrame>
        <table>
          <thead>
            <tr>
              <th>Kriterium</th>
              <th>Gewichtung</th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((key) => (
              <tr key={key}>
                <td>
                  <strong>{CRITERION_LABEL[key]}</strong>
                  <br />
                  {DEFINITIONS[key]}
                </td>
                <td>{formatPercent(DEFAULT_WEIGHTS[key] * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Kategorien können die Gewichtung anpassen, wenn dort andere Schwerpunkte zählen. Jede Abweichung
          nennen wir auf der Kategorieseite. Innerhalb einer Kategorie gilt für alle Programme dieselbe
          Gewichtung.
        </p>

        <h2>Bewertungsskala</h2>
        <p>
          Wir vergeben Werte mit einer Nachkommastelle und nennen sie Redaktionswertung. Den Begriff Note
          verwenden wir nicht, weil er an das Schulnotensystem erinnert, in dem 1 die beste Note ist.
        </p>
        <table>
          <thead>
            <tr>
              <th>Wertung</th>
              <th>Bezeichnung</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map(([range, label]) => (
              <tr key={label}>
                <td>{range}</td>
                <td>{label}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Wie wir recherchieren</h2>
        <p>
          Grundlage jeder Bewertung sind die Dokumentation und die Preisseiten der Anbieter, Hilfecenter,
          Sicherheits- und Datenschutzangaben sowie öffentliche Register wie das Impressum oder das
          Handelsregister. Jede Angabe speichern wir mit Quelle und Abrufdatum. Was wir nicht belegen können,
          kennzeichnen wir als „Keine Angabe“.
        </p>
        <p>
          Wo wir ein Testkonto nutzen konnten, sprechen wir von einem Test. Ohne eigenen Praxistest heißt der
          Beitrag Bewertung oder Überblick. Diese Unterscheidung steht auf jeder Profilseite.
        </p>

        <h2 id="wertung">Worauf jede Kriterienwertung beruht</h2>
        <ul>
          <li>
            <strong>Funktionsumfang:</strong> die dokumentierten Funktionen je Tarif, gemessen an dem, was
            Unternehmen der Kategorie im Alltag brauchen, etwa Belegerfassung, ELSTER und DATEV in der
            Buchhaltung oder Schichtplanung in der Zeiterfassung.
          </li>
          <li>
            <strong>Bedienung und Einrichtung:</strong> Aufbau der Tarife, Testphase, Hilfe beim Umstieg und
            Plattformen. Ohne eigenen Praxistest bleibt dieses Kriterium vorsichtig bewertet.
          </li>
          <li>
            <strong>Preis-Leistung:</strong> Einstiegspreis und Kosten nach Teamgröße im Vergleich zu den
            Programmen derselben Kategorie, dazu Laufzeit, Kündigung und Zusatzkosten.
          </li>
          <li>
            <strong>Datenschutz und Compliance:</strong> Serverstandort, Vertrag zur Auftragsverarbeitung,
            GoBD, E-Rechnung und Zertifikate wie ISO 27001, jeweils laut Anbieter belegt.
          </li>
          <li>
            <strong>Support und Service:</strong> Support auf Deutsch, Kanäle und Erreichbarkeit laut
            Anbieter.
          </li>
          <li>
            <strong>Integrationen und Schnittstellen:</strong> DATEV, ELSTER, offene Schnittstellen und
            dokumentierte Anbindungen an verbreitete Programme.
          </li>
        </ul>
        <p>
          Die Stärken und Schwächen auf jeder Profilseite begründen die Wertung: Jede Schwäche zieht dort ab,
          wo sie Unternehmen im Alltag trifft. Alle Wertungen verantwortet die Redaktion.
        </p>

        <h2 id="marktdaten">Marktdaten und Kennzahlen</h2>
        <p>
          Marktzahlen übernehmen wir nur aus amtlicher Statistik, etwa vom Statistischen Bundesamt, und aus
          veröffentlichten Studien von Verbänden wie Bitkom. Jede Zahl steht mit Herausgeber, Datum, Basis der
          Befragung und Zeitraum an der Grafik. Eigene Hochrechnungen oder Schätzungen zeigen wir nicht als
          Marktdaten.
        </p>
        <p>
          Die Kennzahlen zu einzelnen Programmen, etwa Rang, Preisvergleich oder Kosten nach Teamgröße,
          berechnen wir ausschließlich aus unseren Profilen. Preisvergleiche ziehen nur Programme mit gleicher
          Preisbasis heran, also Preise pro Nutzer mit Preisen pro Nutzer.
        </p>

        <h2>Aktualität</h2>
        <p>
          Preise prüfen wir spätestens alle 180 Tage erneut. Bei jeder Prüfung aktualisieren wir das Datum
          „Stand“ an der Preistabelle. Inhaltliche Änderungen halten wir im Änderungsprotokoll am Ende jeder
          Profilseite fest.
        </p>

        <h2>Auszeichnungen</h2>
        <p>Auszeichnungen berechnen wir aus den Wertungen einer Kategorie. Sie sind nicht käuflich.</p>
        <ul>
          {AWARDS.map((kind) => (
            <li key={kind}>
              <strong>{AWARD_LABEL[kind].title}:</strong> {AWARD_REASON[kind]}
            </li>
          ))}
        </ul>
        <p>Bei Gleichstand entscheidet die höhere Gesamtwertung, danach die alphabetische Reihenfolge.</p>

        <h2>Unabhängigkeit und Provisionen</h2>
        <p>
          Mit * gekennzeichnete Links sind Affiliate-Links. Schließen Sie darüber einen Vertrag ab, erhalten
          wir unter Umständen eine Provision. Für Sie ändert sich der Preis nicht, und auf unsere Bewertungen
          hat die Provision keinen Einfluss. Die Reihenfolge in Ranglisten folgt immer der Redaktionswertung.
          Bezahlte Platzierungen stehen in eigenen Bereichen und sind als Anzeige gekennzeichnet.
        </p>

        <h2>Nutzerbewertungen</h2>
        <p>
          Nutzerbewertungen veröffentlichen wir nur, wenn wir die Verfasserin oder den Verfasser verifiziert
          haben, zum Beispiel über eine geschäftliche E-Mail-Adresse. Wir löschen keine kritischen
          Bewertungen, solange sie unsere Richtlinien einhalten. Bewertungen, die gegen einen Anreiz
          entstanden sind, kennzeichnen wir. Nutzerbewertungen zeigen wir getrennt von der Redaktionswertung
          an und vermischen beide nie zu einer Zahl. Einen Durchschnitt nennen wir erst ab fünf Bewertungen.
        </p>

        <h2>Korrekturen</h2>
        <p>
          Finden Sie einen Fehler, schreiben Sie uns über die Kontaktseite. Wir prüfen jeden Hinweis,
          korrigieren nachweisbare Fehler und vermerken die Korrektur im Änderungsprotokoll.
        </p>
      </div>
    </>
  );
}
