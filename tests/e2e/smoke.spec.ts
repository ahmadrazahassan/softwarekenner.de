import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// next/font/local names each family after its export in app/fonts.ts:
// outfit = Outfit, nunitoSans = Nunito Sans, workSans = Work Sans.
const ALLOWED = ["outfit", "nunitoSans", "workSans"];

test("start page is German, renders only brand fonts and makes no third party requests", async ({
  page,
  baseURL,
}) => {
  const foreignRequests: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (!url.startsWith(baseURL!) && !url.startsWith("data:")) foreignRequests.push(url);
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  // Every computed font stack consists of our families only: no system or generated fallback.
  const stacks = await page.evaluate(() => [
    ...new Set([...document.querySelectorAll("*")].map((el) => getComputedStyle(el).fontFamily)),
  ]);
  for (const stack of stacks) {
    const families = stack.split(",").map((f) => f.trim().replace(/^["']|["']$/g, ""));
    for (const family of families) expect(ALLOWED, stack).toContain(family);
  }

  // Every family used on the page has loaded, and nothing else has.
  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")),
  );
  for (const family of ALLOWED) expect(loaded, family).toContain(family);
  for (const family of loaded) expect(ALLOWED, family).toContain(family);

  expect(foreignRequests).toEqual([]);
});

test("start page has no axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
