import { Page } from 'puppeteer'
declare global {
  interface Window {
    pathSession: any
  }
}
export async function scrapeDeleteToken(page: Page): Promise<boolean> {
  const result = await page
    .evaluate(() => {
      const scrape = window.pathSession
      if (scrape === true) {
        return true
      } else {
        return false
      }
    })
    .catch(() => undefined)
  return result
}
