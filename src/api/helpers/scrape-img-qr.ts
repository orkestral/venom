import { Page } from 'puppeteer';
import { ScrapQrcode } from '../model/qrcode';

export async function scrapeImg(page: Page): Promise<ScrapQrcode | undefined> {
  let click = await page
    .evaluate(() => {
      const buttonReload = document.querySelector('button');
      if (buttonReload != null) {
        buttonReload.click();
        return true;
      }
      return false;
    })
    .catch(() => false);

  if (click) {
    await page.waitForNavigation();
  }

  const result = await page
    .evaluate(() => {
      const selectorImg = document.querySelector('canvas');
      const selectorUrl = selectorImg.closest('[data-ref]');

      if (selectorImg != null && selectorUrl != null) {
        let data = {
          base64Image: selectorImg.toDataURL(),
          urlCode: selectorUrl.getAttribute('data-ref'),
        };
        return data;
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);

  return result;
}
