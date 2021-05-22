import { Page } from 'puppeteer';
export async function scrapeLogin(page: Page): Promise<boolean> {
  const result = await page.evaluate(() => {
    const count = document.querySelector('._9a59P');
    let data: boolean;
    data = false;
    if (count != null) {
      const text = count.textContent,
        timeNumber = text.match('Invalid');
      if (timeNumber) {
        data = true;
      }
      return data;
    }
  });
  return result;
}
