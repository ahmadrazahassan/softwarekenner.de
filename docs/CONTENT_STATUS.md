# Content status

Verification status of every software profile (BUILD_PROMPT Sections 10 and 15.5).
A profile may only be published with `verification: "verifiziert"`, a real author, at least two sources and `pricing.verifiedAt` not older than 180 days. `pnpm content:validate` enforces this.

## Categories

All 14 categories exist as data (`content/categories`). Published (with software): Buchhaltung, Zeiterfassung, HR-Software, Lohnabrechnung, ERP, CRM; each has a Kaufberatung and an FAQ since 22 October 2026. The other eight stay drafts until they have software.

## Vendors (verified 19 October 2026)

| Vendor                    | Legal entity                | Seat                       | German entity | Source                                         |
| ------------------------- | --------------------------- | -------------------------- | ------------- | ---------------------------------------------- |
| Lexware                   | Haufe-Lexware GmbH & Co. KG | Freiburg                   | ja            | Impressum Lexware Office                       |
| sevdesk                   | sevDesk GmbH                | Offenburg                  | ja            | Impressum                                      |
| DATEV                     | DATEV eG                    | Nürnberg                   | ja            | Lobbyregister R003153 (datev.de not reachable) |
| BuchhaltungsButler        | BuchhaltungsButler GmbH     | Berlin                     | ja            | Impressum                                      |
| Buhl Data (WISO MeinBüro) | Buhl Data Service GmbH      | Neunkirchen (Siegerland)   | ja            | Impressum buhl.de and meinbuero.de             |
| Papierkram                | odacer finanzsoftware GmbH  | Wiesbaden                  | ja            | Impressum                                      |
| Candis                    | Candis GmbH                 | Berlin                     | ja            | Impressum                                      |
| Accountable               | Accountable SA              | Saint-Josse-ten-Noode (BE) | unclear       | Impressum                                      |
| Collmex                   | Collmex GmbH (since 2003)   | Saarbrücken                | ja            | Impressum                                      |
| Personio                  | Personio SE & Co. KG        | München                    | ja            | Legal Notice                                   |
| HRworks                   | HRworks GmbH                | Freiburg                   | ja            | Company facts page                             |
| Factorial                 | FACTORIAL GmbH              | München                    | ja            | Impressum                                      |
| Kenjo                     | Kenjo GmbH                  | Berlin                     | ja            | Impressum                                      |
| rexx systems              | Rexx Systems GmbH           | Hamburg                    | ja            | Impressum                                      |
| Leapsome                  | Leapsome GmbH               | Berlin                     | ja            | Impressum                                      |
| SAP (SuccessFactors)      | SAP SE                      | Walldorf                   | ja            | Impressum SAP SE                               |
| Clockodo                  | Clockodo GmbH               | Unna                       | ja            | Impressum                                      |
| Crewmeister               | ATOSS Aloud GmbH            | München                    | ja            | Impressum                                      |
| clockin                   | clockin GmbH                | Münster                    | ja            | Impressum                                      |
| TimeTac                   | TimeTac GmbH                | Graz (AT)                  | nein          | Impressum                                      |
| Papershift                | Papershift GmbH             | Karlsruhe                  | ja            | Impressum                                      |
| ZEP                       | ZEP GmbH                    | Ditzingen                  | ja            | Impressum                                      |

Not verified for any vendor yet: founding year (except Collmex) and support languages. Both stay empty until a source states them.

## Software profiles

| Slug                          | Category                        | Verification | Hands on test | Prices verified | Sources | Review | Open gaps                                                      |
| ----------------------------- | ------------------------------- | ------------ | ------------- | --------------- | ------- | ------ | -------------------------------------------------------------- |
| accountable                   | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, iso27001, bsiC5                                           |
| buchhaltungsbutler            | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, iso27001, bsiC5                                           |
| candis                        | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, bsiC5                                                     |
| centralstationcrm             | crm                             | verifiziert  | nein          | 2026-10-21      | 3       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| clockin                       | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| clockodo                      | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 3       | ja     | gobd, xrechnung, zugferd, iso27001, bsiC5                      |
| collmex                       | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, bsiC5                                                     |
| crewmeister                   | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| datev-lohn-und-gehalt         | lohnabrechnung                  | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| datev-unternehmen-online      | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, iso27001, bsiC5                                           |
| dynamics-365-business-central | erp                             | verifiziert  | nein          | 2026-10-21      | 3       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| easybill                      | buchhaltung, rechnungsprogramme | verifiziert  | nein          | 2026-10-23      | 6       | ja     | iso27001, bsiC5                                                |
| fastbill                      | buchhaltung, rechnungsprogramme | verifiziert  | nein          | 2026-10-23      | 3       | ja     | avv, iso27001, bsiC5                                           |
| factorial                     | hr-software                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, bsiC5                           |
| hrworks                       | hr-software                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| kenjo                         | hr-software, zeiterfassung      | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| leapsome                      | hr-software                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, gobd, xrechnung, zugferd, bsiC5                           |
| lexware-lohn-gehalt           | lohnabrechnung                  | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| lexware-office                | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, bsiC5                                                     |
| papershift                    | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| papierkram                    | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, iso27001, bsiC5                                           |
| personio                      | hr-software                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| pipedrive                     | crm                             | verifiziert  | nein          | 2026-10-23      | 5       | ja     | gobd, xrechnung, zugferd, bsiC5                                |
| rexx-systems                  | hr-software                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, bsiC5                           |
| sage-100                      | erp                             | verifiziert  | nein          | 2026-10-21      | 6       | ja     | serverLocation, avv, iso27001, bsiC5                           |
| sage-50-handwerk              | erp                             | verifiziert  | nein          | 2026-10-21      | 4       | ja     | avv, iso27001, bsiC5                                           |
| sage-50                       | buchhaltung, erp                | verifiziert  | nein          | 2026-10-21      | 4       | ja     | avv, iso27001, bsiC5                                           |
| sage-active                   | buchhaltung                     | verifiziert  | nein          | 2026-10-21      | 3       | ja     | serverLocation, avv, iso27001, bsiC5                           |
| sage-b7                       | erp                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, xrechnung, zugferd, iso27001, bsiC5       |
| sage-hr-suite                 | hr-software, lohnabrechnung     | verifiziert  | nein          | 2026-10-21      | 4       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| sage-hr                       | hr-software                     | verifiziert  | nein          | 2026-10-21      | 3       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sage-intacct                  | buchhaltung                     | verifiziert  | nein          | 2026-10-21      | 3       | ja     | serverLocation, avv, xrechnung, zugferd, bsiC5                 |
| sage-lohnabrechnung           | lohnabrechnung, hr-software     | verifiziert  | nein          | 2026-10-21      | 3       | ja     | serverLocation, gobd, xrechnung, zugferd, iso27001, bsiC5      |
| sage-operations               | erp                             | verifiziert  | nein          | 2026-10-21      | 3       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sage-sales-management         | crm                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sage-wincarat                 | erp                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sage-x3                       | erp                             | verifiziert  | nein          | 2026-10-21      | 4       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sap-business-one              | erp                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | serverLocation, avv, gobd, xrechnung, zugferd, iso27001, bsiC5 |
| sap-successfactors            | hr-software                     | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| sevdesk                       | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, iso27001, bsiC5                                           |
| timetac                       | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 3       | ja     | avv, gobd, xrechnung, zugferd, bsiC5                           |
| weclapp                       | erp                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| wiso-meinbuero                | buchhaltung                     | verifiziert  | nein          | 2026-10-19      | 3       | ja     | serverLocation, avv, iso27001, bsiC5                           |
| xentral                       | erp                             | verifiziert  | nein          | 2026-10-21      | 2       | ja     | avv, gobd, xrechnung, zugferd, iso27001, bsiC5                 |
| zep                           | zeiterfassung                   | verifiziert  | nein          | 2026-10-19      | 2       | ja     | avv, gobd, xrechnung, zugferd, bsiC5                           |

45 profiles. Pipedrive, easybill and FastBill added on 23 October 2026 as affiliate partners, with the same research and publishing rules. 42 profiles were published on 21 October 2026 after editorial approval by Wolfram Eschenbach (`status: "veroeffentlicht"`, `verification: "verifiziert"`): 22 researched on 19 October 2026, 20 added on 21 October 2026 (the complete German Sage portfolio plus weclapp, Xentral, SAP Business One, Microsoft Dynamics 365 Business Central, DATEV Lohn und Gehalt, Lexware lohn+gehalt and CentralStationCRM). Every profile has a long form review in content/reviews, written as "im Überblick" without hands on test, with sourced key figures and charts from our own price data. "Open gaps" lists fields that stay `unbekannt` because no vendor source states them. Logo sources: docs/LOGOS.md.

## Ratgeber (content/guides)

All published on 22 October 2026, author and reviewer Wolfram Eschenbach, every fact with a source (accessed 22 October 2026). Owner review pending.

| Slug                            | Topic           | Sources | Words | Checked    |
| ------------------------------- | --------------- | ------- | ----- | ---------- |
| arbeitszeiterfassung-pflicht    | Arbeitsrecht    | 5       | 913   | 2026-10-22 |
| auftragsverarbeitung-cloud      | Datenschutz     | 5       | 982   | 2026-10-22 |
| betriebsrat-softwareeinfuehrung | Mitbestimmung   | 5       | 890   | 2026-10-22 |
| e-rechnung-pflicht              | E-Rechnung      | 6       | 1061  | 2026-10-22 |
| gobd-aufbewahrung               | GoBD            | 5       | 1103  | 2026-10-22 |
| kleinunternehmerregelung        | Umsatzsteuer    | 5       | 730   | 2026-10-22 |
| softwareauswahl-checkliste      | Softwareauswahl | 4       | 1032  | 2026-10-22 |

Recheck before relying on them: status of the Arbeitszeitgesetz draft (BMAS, June 2026), the appeal C-703/25 P on the EU-U.S. Data Privacy Framework, further BMF letters on the E-Rechnung.

## Kaufberatung (content/kaufberatung)

One per category with published software, published on 22 October 2026, plus four or five FAQ entries in each category JSON. Below the 1.500 word target of Section 13.2.

| Category       | Sources | Words | Checked    |
| -------------- | ------- | ----- | ---------- |
| buchhaltung    | 4       | 1066  | 2026-10-22 |
| crm            | 4       | 913   | 2026-10-22 |
| erp            | 3       | 913   | 2026-10-22 |
| hr-software    | 4       | 889   | 2026-10-22 |
| lohnabrechnung | 4       | 723   | 2026-10-22 |
| zeiterfassung  | 4       | 907   | 2026-10-22 |

## Authors

| Slug               | Name               | Role              | Photo    |
| ------------------ | ------------------ | ----------------- | -------- |
| wolfram-eschenbach | Wolfram Eschenbach | Gründer und Autor | none yet |

No second reviewer yet: profiles use the same person as author and reviewer, which the guards report as a warning.

## Pending hands on observations (`<Praxisnotiz status="ausstehend">`)

| Slug       | What the editor should test |
| ---------- | --------------------------- |
| (none yet) |                             |

## Candidate checks (Section 16.2)

| Date       | Product     | Result                 | Reason                                                                                          |
| ---------- | ----------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| 2026-10-19 | Crewmeister | Vendor updated         | Provider is ATOSS Aloud GmbH                                                                    |
| 2026-10-19 | ZEP         | Vendor updated         | Provider renamed from provantis IT Solutions GmbH to ZEP GmbH                                   |
| 2026-10-19 | TimeTac     | Keep, check in Phase 5 | Austrian provider without German entity; listing depends on German UI or support and EUR prices |
