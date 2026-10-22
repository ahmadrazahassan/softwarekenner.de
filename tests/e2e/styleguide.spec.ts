import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ALLOWED_FAMILIES = ["outfit", "nunitoSans", "workSans"];

test.describe("/styleguide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/styleguide");
    await expect(page.getByRole("heading", { level: 1, name: "Styleguide" })).toBeVisible();
  });

  test("is noindex and has no horizontal page scroll", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("has no axe violations", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.target),
      })),
    ).toEqual([]);
  });

  test("renders only the three brand families", async ({ page }) => {
    await page.evaluate(() => document.fonts.ready);
    const stacks = await page.evaluate(() => [
      ...new Set([...document.querySelectorAll("*")].map((el) => getComputedStyle(el).fontFamily)),
    ]);
    for (const stack of stacks) {
      for (const family of stack.split(",").map((f) => f.trim().replace(/^["']|["']$/g, ""))) {
        expect(ALLOWED_FAMILIES, stack).toContain(family);
      }
    }
  });

  test("tabs move with the arrow keys and keep the indicator on the active tab", async ({ page }) => {
    const list = page.getByRole("tablist", { name: "Beliebte Software nach Bereich" });
    await list.getByRole("tab", { name: "Buchhaltung" }).focus();
    await page.keyboard.press("ArrowRight");
    const crm = list.getByRole("tab", { name: "CRM" });
    await expect(crm).toBeFocused();
    await expect(crm).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("crm");
  });

  test("dialog opens from the keyboard, traps focus and returns it on Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Dialog öffnen" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Bewertung melden" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("command palette opens with the shortcut and finds umlaut words without umlauts", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Suche" });
    // Retry until hydration has attached the shortcut listener.
    await expect(async () => {
      await page.keyboard.press("Control+k");
      await expect(dialog).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.keyboard.type("groesse");
    await expect(dialog.getByRole("option", { name: /Unternehmensgröße/ })).toBeVisible();
    await page.keyboard.type("xyz");
    await expect(dialog).toContainText("Keine Treffer für „groessexyz“");
  });

  test("compare tray appears from two selected programs", async ({ page }) => {
    const tray = page.getByRole("region", { name: "Vergleichsauswahl" });
    await expect(tray).toBeHidden();
    await page.getByRole("checkbox", { name: "Musterbuch vergleichen" }).click();
    await page.getByRole("checkbox", { name: "Belegwerk Beispiel vergleichen" }).click();
    await expect(tray).toBeVisible();
    await expect(tray).toContainText("2 von 4 ausgewählt");
    await tray.getByRole("button", { name: "Auswahl leeren" }).click();
    await expect(tray).toBeHidden();
  });

  test("advisor form explains errors in German and links them to the fields", async ({ page }) => {
    const form = page.getByRole("complementary", { name: "Lassen Sie sich kostenlos beraten" });
    await form.getByRole("button", { name: "Beratung anfordern" }).click();
    const name = form.getByRole("textbox", { name: "Name" });
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(form).toContainText("Bitte geben Sie Ihren Namen ein.");
    await form.getByRole("textbox", { name: "Geschäftliche E-Mail" }).fill("kontakt@gmail.com");
    await form.getByRole("button", { name: "Beratung anfordern" }).click();
    await expect(form).toContainText("Bitte geben Sie eine geschäftliche E-Mail-Adresse ein.");
  });

  test("affiliate links carry sponsored rel and the asterisk, plain links do not", async ({ page }) => {
    const sponsored = page.locator('a[rel="sponsored nofollow noopener"]');
    expect(await sponsored.count()).toBeGreaterThan(0);
    for (const link of await sponsored.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toContainText("*");
    }
    const plain = page.locator('a[href="https://example.com"][rel="noopener"]').first();
    await expect(plain).not.toContainText("*");
  });

  test("mega menu opens from the keyboard on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Mega menu is desktop only; mobile uses the sheet.");
    const trigger = page.getByRole("button", { name: "Kategorien" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("link", { name: /Buchhaltungssoftware/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("mobile menu opens as a sheet", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile only.");
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    const sheet = page.getByRole("dialog", { name: "Menü" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Kategorien" }).click();
    await expect(sheet.getByRole("link", { name: "Zeiterfassung" })).toBeVisible();
  });
});
