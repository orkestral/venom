import { Page } from 'puppeteer';
import { ScrapQrcode } from '../model/qrcode';

export async function scrapeImg(page: Page): Promise<ScrapQrcode | undefined> {
  let click = await page.evaluate(async () => {
    const buttonReload = document.querySelector('button.Jht5u');
    if (buttonReload != null) {
      return true;
    }
    return false;
  });

  if (click) {
    const buttonReloadElementHandle = await page.$('button.Jht5u');
    if (buttonReloadElementHandle) {
      await buttonReloadElementHandle.click();
    }
  }

  const result = await page
    .evaluate(() => {
      const selectorImg = document.querySelector('canvas');
      const selectorUrl = selectorImg.closest('[data-ref]');
      const buttonReload = document.querySelector('button.Jht5u');

      if (buttonReload === null && selectorImg != null && selectorUrl != null) {
        let data = {
          base64Image: selectorImg.toDataURL(),
          urlCode: selectorUrl.getAttribute('data-ref')
        };
        return data;
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);

  return result;
}
