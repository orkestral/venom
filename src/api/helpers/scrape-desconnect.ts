import { Page } from 'puppeteer';
declare global {
  interface Window {
    Store: any;
    Stream: any;
  }
}
export async function scrapeDesconnected(page: Page): Promise<boolean> {
  const result = await page
    .evaluate(() => {
      const scrape = window.Store.State.Socket.on('change:state');
      if (
        scrape.__x_stream === 'DISCONNECTED' &&
        scrape.__x_state === 'CONNECTED'
      ) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => undefined);
  return result;
}
