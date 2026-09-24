import { chromium } from "playwright";

const baseUrl = process.env.TEST_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator("h1", { hasText: "Naanda" }).waitFor();
  await page.getByRole("link", { name: "LinkedIn" }).waitFor();
  await page.getByRole("link", { name: "GitHub" }).waitFor();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".hero-still").waitFor();
  console.log("Visual smoke test passed.");
} finally {
  await browser.close();
}
