import { Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';

export async function checkingCloses(
  browser: Browser | string,
  mergedOptions: CreateConfig,
  callStatus: (e: string) => void
) {
  new Promise(async (resolve, reject) => {
    if (typeof browser !== 'string') {
      let err: boolean;
      do {
        try {
          await new Promise((r) => setTimeout(r, 2000));
          if (
            browser['isClose'] ||
            (mergedOptions.browserWS && !browser.connected)
          ) {
            if (mergedOptions.browserWS) {
              browser.disconnect();
              callStatus && callStatus('serverClose');
            }
            if (browser['isClose']) {
              browser.close().catch((e) => reject(e));
              callStatus && callStatus('browserClose');
            }
            err = false;
          } else {
            throw 1;
          }
        } catch (e) {
          err = true;
        }
      } while (err);
    }
  });
}
