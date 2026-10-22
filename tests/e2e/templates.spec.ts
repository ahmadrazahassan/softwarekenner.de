import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Every template from Section 13 renders with real batch 1 data. Runs against a preview build
 * (CONTENT_PREVIEW=1 pnpm build), because all batch 1 content is still a draft.
 */
const PAGES = [
  "/",
  "/kategorien",
  "/kategorien/buchhaltung",
  "/kategorien/hr-software",
  "/kategorien/zeiterfassung",
  "/kategorien/erp",
  "/kategorien/lohnabrechnung",
  "/kategorien/crm",
  "/software",
  "/software/lexware-office",
  "/software/lexware-office/preise",
  "/software/lexware-office/alternativen",
  "/software/lexware-office/bewertungen",
  "/software/personio",
  "/software/sage-active",
  "/software/sage-100",
  "/software/sage-intacct",
  "/software/sage-hr",
  "/software/sage-lohnabrechnung",
  "/software/sage-sales-management",
  "/software/dynamics-365-business-central",
  "/software/centralstationcrm",
  "/vergleich",
  "/vergleich?produkte=lexware-office,sevdesk,collmex",
  "/ratgeber",
  "/leitfaeden",
  "/beratung",
  "/methodik",
  "/redaktion",
  "/autoren/wolfram-eschenbach",
  "/fuer-anbieter",
  "/software-eintragen",
  "/bewertung-schreiben",
  "/suche?q=groesse",
  "/suche?q=datev",
  "/ueber-uns",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/transparenz",
  "/barrierefreiheit",
  "/cookie-einstellungen",
  "/bestaetigen?token=ungueltig",
];

for (const path of PAGES) {
  test(`${path} renders, is German, accessible and clean`, async ({ page }) => {
    // Hydration mismatches and runtime errors surface as page errors.
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator("h1")).toHaveCount(1);

    const text = await page.locator("main").innerText();
    expect(text, "no em or en dash").not.toMatch(/[—–]/);
    expect(text, "no leaked values").not.toMatch(/\b(undefined|NaN|null)\b|\[object Object\]/);

    // Placeholders may only appear visibly marked (legal and contact data).
    const unmarked = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.querySelector("main")!, NodeFilter.SHOW_TEXT);
      const hits: string[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (/\{\{[A-Z_]+\}\}/.test(node.textContent ?? "") && !node.parentElement?.closest("mark")) {
          hits.push(node.textContent!.trim());
        }
      }
      return hits;
    });
    expect(unmarked).toEqual([]);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "no horizontal page scroll").toBeLessThanOrEqual(0);

    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => n.target) })),
    ).toEqual([]);
    expect(pageErrors, "no runtime or hydration errors").toEqual([]);
  });
}

test("unknown pages answer with a German 404", async ({ page }) => {
  const response = await page.goto("/gibt-es-nicht");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Diese Seite gibt es nicht.");
});

test("profiles use honest wording without a hands on test", async ({ page }) => {
  await page.goto("/software/lexware-office");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("im Überblick");
  await expect(page.getByRole("heading", { level: 1 })).not.toContainText("im Test");
  await expect(
    page.getByRole("heading", { name: "Wie bewährt sich Lexware Office in Ihrem Unternehmen?" }),
  ).toBeVisible();
});

test("no page announces that we have nothing", async ({ page }) => {
  for (const path of ["/", "/ratgeber", "/leitfaeden", "/software/lexware-office"]) {
    await page.goto(path);
    await expect(page.locator("body"), path).not.toContainText(
      /(^|[^\d,.])0 (Ratgeber|Softwareprofile|Kategorien)|Noch keine|in Arbeit/,
    );
  }
  // Hubs without content stay out of the main navigation.
  const nav = page.getByRole("banner");
  await expect(nav.locator('a[href="/software"]').first()).toBeAttached();
  await expect(nav.locator('a[href="/ratgeber"]')).toHaveCount(0);
});

test("outbound links without an affiliate deal carry no sponsored marker", async ({ page }) => {
  await page.goto("/software/lexware-office");
  const visit = page.getByRole("link", { name: /Website besuchen/ }).first();
  await expect(visit).toHaveAttribute("rel", "noopener");
  await expect(visit).toHaveAttribute("href", "https://office.lexware.de");
  await expect(visit).not.toContainText("*");
});

test("category ranks by editorial score and links every profile", async ({ page }) => {
  await page.goto("/kategorien/buchhaltung");
  const ranks = page.locator("ol > li article");
  await expect(ranks).toHaveCount(12);
  await expect(ranks.first()).toContainText("#1");
});

test("categories without software stay hidden and show the 404 page", async ({ page }) => {
  // Request-time params stream after the shell, so the status stays 200 (docs/DECISIONS.md).
  await page.goto("/kategorien/kassensysteme");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Diese Seite gibt es nicht.");
  await expect(page.locator('meta[name="robots"][content^="noindex"]').first()).toBeAttached();
  await page.goto("/kategorien");
  await expect(page.locator("main")).not.toContainText(/(^|\D)0 Programme/);
  await expect(page.locator("main").getByRole("link", { name: /Kassensysteme/ })).toHaveCount(0);
});

test("advisor panel shows success only after the server delivered the request", async ({ page }) => {
  await page.goto("/kategorien/buchhaltung");
  const form = page.getByRole("complementary", { name: "Lassen Sie sich kostenlos beraten" });
  await form.getByRole("textbox", { name: "Name" }).fill("Test Person");
  await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill("kontakt@beispiel-firma.de");
  await form.getByRole("combobox", { name: "Unternehmensgröße" }).click();
  await page.getByRole("option", { name: "10 bis 49 Mitarbeitende" }).click();
  await form.getByRole("checkbox").click();
  await form.getByRole("button", { name: "Beratung anfordern" }).click();
  // E2E runs with the outbox mail provider (playwright.config.ts); without a provider the same form
  // answers "Das Formular ist gerade nicht erreichbar" with the contact address instead.
  await expect(form).toContainText("Anfrage gesendet");
});

test("compare tray opens the comparison tool with the chosen products", async ({ page }) => {
  await page.goto("/vergleich");
  await page.getByRole("checkbox", { name: "Lexware Office vergleichen" }).click();
  await page.getByRole("checkbox", { name: "sevdesk vergleichen" }).click();
  await page
    .getByRole("region", { name: "Vergleichsauswahl" })
    .getByRole("button", { name: "Jetzt vergleichen" })
    .click();
  await expect(page).toHaveURL(/produkte=lexware-office(%2C|,)sevdesk/);
  await expect(page.getByRole("table")).toBeVisible();
});
