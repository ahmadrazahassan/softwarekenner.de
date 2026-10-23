import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { OUTBOX_DIR } from "../../playwright.config";

/**
 * Phase 4 flows (docs/BUILD_PROMPT.md Section 21). Runs against a preview build started with the
 * outbox mail provider (playwright.config.ts), so double opt in can be followed end to end.
 */

type Mail = { to: string; subject: string; text: string; replyTo?: string };

/** Newest mail to an address, waiting until it arrives. */
async function mailTo(address: string, subject?: RegExp): Promise<Mail> {
  let found: Mail | undefined;
  await expect
    .poll(
      async () => {
        const files = (await readdir(OUTBOX_DIR).catch(() => [] as string[]))
          .filter((f) => f.endsWith(".json") && f !== "contacts.json")
          .sort()
          .reverse();
        for (const f of files) {
          const mail = JSON.parse(await readFile(path.join(OUTBOX_DIR, f), "utf8")) as Mail;
          if (mail.to === address && (!subject || subject.test(mail.subject))) {
            found = mail;
            return true;
          }
        }
        return false;
      },
      { timeout: 10_000 },
    )
    .toBe(true);
  return found!;
}

const linkIn = (mail: Mail) => mail.text.match(/https?:\/\/\S+\/bestaetigen\?token=[A-Za-z0-9_-]+/)![0];
const unique = (prefix: string, page: Page) =>
  `${prefix}-${test.info().project.name}-${Date.now()}@musterfirma-${page.viewportSize()?.width}.de`;

test("search, category, filter, compare, profile and outbound link", async ({ page, isMobile }) => {
  await page.goto("/");
  // Search (command palette on desktop, results page on mobile).
  if (isMobile) {
    await page.goto("/suche?q=buchhaltung");
    await page
      .getByRole("link", { name: /Buchhaltungssoftware/ })
      .first()
      .click();
  } else {
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Suche" });
    await dialog.getByRole("combobox").fill("Buchhaltung");
    await dialog
      .getByRole("option", { name: /Buchhaltungssoftware/ })
      .first()
      .click();
  }
  await expect(page).toHaveURL(/\/kategorien\/buchhaltung/);

  // Filter: server in Germany, state lands in the URL.
  await page.getByRole("button", { name: "Serverstandort" }).click();
  await page.getByRole("checkbox", { name: "Deutschland" }).click();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/server=DE/);
  await expect(page.locator("#programme-titel")).toContainText("von 9 Programmen");

  // Compare the first two visible products.
  const visible = page.locator("ol > li:not([hidden])");
  await visible
    .nth(0)
    .getByRole("checkbox", { name: /vergleichen/ })
    .click();
  await visible
    .nth(1)
    .getByRole("checkbox", { name: /vergleichen/ })
    .click();
  await page
    .getByRole("region", { name: "Vergleichsauswahl" })
    .getByRole("button", { name: "Jetzt vergleichen" })
    .click();
  await expect(page).toHaveURL(/\/vergleich\?produkte=/);
  await expect(page.getByRole("table")).toBeVisible();

  // The selection survives a reload (sessionStorage, slugs only).
  await page.reload();
  await expect(page.getByRole("region", { name: "Vergleichsauswahl" })).toContainText("2 von 4 ausgewählt");

  // Profile and its outbound link: without an affiliate deal it goes straight to the vendor.
  await page.goto("/software/lexware-office");
  const visit = page.getByRole("link", { name: /Website besuchen/ }).first();
  await expect(visit).toHaveAttribute("href", "https://office.lexware.de");
});

test("/go redirects with noindex and never to unknown targets", async ({ request }) => {
  const known = await request.get("/go/lexware-office?from=profil&pos=1", { maxRedirects: 0 });
  expect(known.status()).toBe(307);
  expect(known.headers()["location"]).toMatch(/\/software\/lexware-office$/);
  expect(known.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(known.headers()["cache-control"]).toBe("no-store");

  const unknown = await request.get("/go/gibt-es-nicht?from=evil", { maxRedirects: 0 });
  expect(unknown.status()).toBe(307);
  expect(unknown.headers()["location"]).toMatch(/\/software$/);

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /go/");
});

test("Softwarefinder returns three reasoned matches", async ({ page }) => {
  await page.goto("/");
  const finder = page.locator("section", { has: page.locator("#finder-titel") });
  await finder.getByRole("radio", { name: "Zeiterfassung" }).click();
  await finder.getByRole("button", { name: "Weiter" }).click();
  await finder.getByRole("radio", { name: "10 bis 49 Mitarbeitende" }).click();
  await finder.getByRole("button", { name: "Weiter" }).click();
  await finder.getByRole("checkbox", { name: "Mobile App" }).click();
  await finder.getByRole("button", { name: "Passende Software anzeigen" }).click();
  const results = finder.getByRole("listitem");
  await expect(results).toHaveCount(3);
  await expect(results.first()).toContainText("Redaktionswertung");
  await finder.getByRole("button", { name: "Neu starten" }).click();
  await expect(finder.getByText("Schritt 1 von 3")).toBeVisible();
});

test("advice wizard validates each step and confirms only after delivery", async ({ page }) => {
  const email = unique("beratung", page);
  await page.goto("/beratung");
  const form = page.getByRole("form", { name: "Beratung anfragen" });
  await form.getByRole("button", { name: "Weiter" }).click();
  await expect(form).toContainText("Bitte wählen Sie eine Kategorie");
  await expect(form.getByRole("combobox")).toBeFocused();

  await form.getByRole("combobox").click();
  await page.getByRole("option", { name: "Buchhaltung" }).click();
  await form.getByRole("button", { name: "Weiter" }).click();
  await form.getByRole("combobox", { name: "Unternehmensgröße" }).click();
  await page.getByRole("option", { name: "10 bis 49 Mitarbeitende" }).click();
  await form.getByRole("checkbox", { name: "DATEV-Schnittstelle" }).click();
  await form.getByRole("button", { name: "Weiter" }).click();

  await form.getByRole("textbox", { name: "Name" }).fill("Test Person");
  await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill("test@gmail.com");
  await form.getByRole("button", { name: "Beratung anfordern" }).click();
  await expect(form).toContainText("Bitte geben Sie eine geschäftliche E-Mail-Adresse ein.");
  await expect(form).toContainText("Bitte bestätigen Sie die Einwilligung");

  await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill(email);
  await form.getByRole("checkbox").last().click();
  await form.getByRole("button", { name: "Beratung anfordern" }).click();
  await expect(page.getByRole("status")).toContainText("Anfrage gesendet");

  const inbox = await mailTo("redaktion@outbox.test", /Beratungsanfrage: Buchhaltung/);
  expect(inbox.replyTo).toBe(email);
  expect(inbox.text).toContain("DATEV-Schnittstelle");
  await mailTo(email, /Ihre Beratungsanfrage/);
});

test("newsletter double opt in needs the link and a click", async ({ page }) => {
  const email = unique("newsletter", page);
  await page.goto("/methodik");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("textbox", { name: "E-Mail-Adresse" }).fill(email);
  await footer.getByRole("button", { name: "Anmelden" }).click();
  await expect(footer.getByRole("status")).toContainText("Bitte bestätigen Sie Ihre Anmeldung");

  const mail = await mailTo(email, /Newsletter/);
  const link = linkIn(mail);
  // The link itself holds no email address.
  expect(link).not.toContain(encodeURIComponent(email));
  expect(link).not.toContain(email);

  await page.goto(link.replace(/^https?:\/\/[^/]+/, ""));
  await page.getByRole("button", { name: "Anmeldung bestätigen" }).click();
  await expect(page.getByRole("status")).toContainText("Vielen Dank, bestätigt.");

  const contacts = JSON.parse(await readFile(path.join(OUTBOX_DIR, "contacts.json"), "utf8")) as Record<
    string,
    { email: string; confirmed: boolean }
  >;
  expect(Object.values(contacts).find((c) => c.email === email)?.confirmed).toBe(true);
});

test("newsletter page offers the sign up form", async ({ page }) => {
  await page.goto("/newsletter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Einmal im Monat das Wichtigste");
  await expect(page.getByRole("complementary").getByRole("button", { name: "Anmelden" })).toBeVisible();
});

test("broken confirmation links explain what to do", async ({ page }) => {
  await page.goto("/bestaetigen?token=gefaelschtgefaelschtgefaelschtgefaelschtgefaelscht");
  await expect(page.getByText("Dieser Link funktioniert nicht mehr")).toBeVisible();
});

test("review form: three steps, business email, confirmation", async ({ page }) => {
  const email = unique("bewertung", page);
  await page.goto("/bewertung-schreiben");
  const form = page.getByRole("form", { name: "Bewertung schreiben" });

  await form.getByRole("combobox").click();
  await page.getByRole("option", { name: "sevdesk" }).click();
  for (const group of ["Gesamteindruck", "Bedienung", "Funktionen", "Preis-Leistung", "Support"]) {
    await form.getByRole("group", { name: group }).getByRole("radio", { name: "4 Sterne" }).check();
  }
  await form.getByRole("button", { name: "Weiter" }).click();

  await form.getByRole("textbox", { name: "Titel Ihrer Bewertung" }).fill("Solide für kleine Teams");
  await form.getByRole("textbox", { name: "Was gefällt Ihnen?" }).fill("Klare Oberfläche, schneller Export");
  await form
    .getByRole("textbox", { name: "Was gefällt Ihnen nicht?" })
    .fill("Wenige Berichte und Auswertungen");
  await form.getByRole("textbox", { name: "Ihre Erfahrung" }).fill("Zu kurz.");
  await form.getByRole("button", { name: "Weiter" }).click();
  await expect(form).toContainText("Bitte schreiben Sie mindestens 200 Zeichen.");
  await form
    .getByRole("textbox", { name: "Ihre Erfahrung" })
    .fill("Wir nutzen das Programm seit gut einem Jahr für Rechnungen und Belege. ".repeat(4));
  await form.getByRole("combobox", { name: "Wie lange nutzen Sie das Programm?" }).click();
  await page.getByRole("option", { name: "1 bis 2 Jahre" }).click();
  await form.getByRole("button", { name: "Weiter" }).click();

  await form.getByRole("textbox", { name: "Ihre Rolle im Unternehmen" }).fill("Geschäftsführung");
  await form.getByRole("textbox", { name: "Branche" }).fill("Handwerk");
  await form.getByRole("combobox", { name: "Unternehmensgröße" }).click();
  await page.getByRole("option", { name: "1 bis 9 Mitarbeitende" }).click();
  await form.getByRole("textbox", { name: "Name für die Anzeige" }).fill("Anna M.");
  await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill(email);
  await form.getByRole("checkbox", { name: /beruflich/ }).click();
  await form.getByRole("checkbox", { name: /einverstanden/ }).click();
  await form.getByRole("button", { name: "Bewertung senden" }).click();
  await expect(page.getByRole("status")).toContainText("Fast geschafft");

  const queued = await mailTo("redaktion@outbox.test", /Neue Bewertung \(unbestätigt\).*sevdesk/);
  expect(queued.text).toContain("Anreiz erhalten: nein");
  const confirm = await mailTo(email, /Bitte bestätigen Sie Ihre Bewertung/);
  await page.goto(linkIn(confirm).replace(/^https?:\/\/[^/]+/, ""));
  await page.getByRole("button", { name: "Bewertung bestätigen" }).click();
  await expect(page.getByRole("status")).toContainText("Vielen Dank, bestätigt.");
  await mailTo("redaktion@outbox.test", /Bewertung bewertung-[a-f0-9]+ bestätigt/);
});

test("software listing form sends to the editorial inbox", async ({ page }) => {
  const email = unique("eintrag", page);
  await page.goto("/software-eintragen");
  const form = page.getByRole("form", { name: "Angaben zur Software senden" });
  await form.getByRole("combobox", { name: "Ihr Anliegen" }).click();
  await page.getByRole("option", { name: "Bestehendes Profil übernehmen" }).click();
  await form.getByRole("textbox", { name: "Produktname" }).fill("Beispielprogramm");
  await form.getByRole("textbox", { name: "Website des Produkts" }).fill("http://beispiel.de");
  await form.getByRole("textbox", { name: "Anbieter laut Impressum" }).fill("Beispiel GmbH");
  await form.getByRole("textbox", { name: "Ihr Name" }).fill("Test Person");
  await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill(email);
  await form.getByRole("checkbox").click();
  await form.getByRole("button", { name: "Angaben senden" }).click();
  await expect(form).toContainText("Bitte geben Sie eine Adresse mit https:// an.");
  await form.getByRole("textbox", { name: "Website des Produkts" }).fill("https://beispiel.de");
  await form.getByRole("button", { name: "Angaben senden" }).click();
  await expect(page.getByRole("status")).toContainText("Angaben gesendet");
  const mail = await mailTo("redaktion@outbox.test", /Bestehendes Profil übernehmen: Beispielprogramm/);
  expect(mail.replyTo).toBe(email);
});

test("charts offer their data as a table", async ({ page }) => {
  await page.goto("/kategorien/buchhaltung");
  const figure = page.locator("figure", { hasText: "Einstiegspreise" });
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.getByRole("img")).toHaveAttribute("aria-label", /Balkendiagramm der Einstiegspreise/);
  await figure.getByRole("button", { name: "Daten als Tabelle anzeigen" }).click();
  await expect(figure.getByRole("table")).toContainText("Lexware Office");
  await figure.getByRole("button", { name: "Diagramm anzeigen" }).click();
  await expect(figure.getByRole("img")).toBeVisible();
});

test("no consent banner and no third party request without a service that needs consent", async ({
  page,
}) => {
  const foreign: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol.startsWith("http")) {
      foreign.push(url.hostname);
    }
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.goto("/software/lexware-office", { waitUntil: "networkidle" });
  await expect(page.getByRole("region", { name: "Ihre Einwilligung" })).toHaveCount(0);
  expect(foreign).toEqual([]);
});

test("keyboard only: skip link, menu, search and filters", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard flow runs on desktop");
  await page.goto("/kategorien/buchhaltung");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#inhalt")).toBeFocused();

  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Suche" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Suche" })).toHaveCount(0);

  const pill = page.getByRole("button", { name: "Testphase" });
  await pill.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/testphase=ja/);
  await expect(pill).toBeFocused();
});
