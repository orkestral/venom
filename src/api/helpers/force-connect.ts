import { Page } from 'puppeteer';
import { sleep } from '../../utils/sleep';
export async function loadForceConnect(
  page: Page,
  callback: (infoLog: string | true) => void,
  attempts: number,
  sleeps: number
) {
  try {
    page.on('load', async () => {
      await page
        .evaluate(() => {
          window['connectionAttempts'] = 0;
        })
        .catch(() => undefined);
    });

    while (true) {
      if (page.isClosed()) break;

      if (attempts <= 0) {
        attempts = 1;
      }
      if (sleeps === 0) {
        sleeps = 5000;
      }

      const checkStatus: string | true = (await page
        .evaluate((attempts) => {
          if (
            window.Store &&
            window.Store.State &&
            window.Store.State.Socket &&
            window.Store.State.Socket.state
          ) {
            const status = window.Store.State.Socket.state;
            if (status !== 'CONNECTED') {
              if (window['connectionAttempts'] >= attempts) {
                window.location.reload();
                window['connectionAttempts'] = 0;
                return true;
              }
              window['connectionAttempts']++;
              return `Number of attempts ${window['connectionAttempts']} of ${attempts}, status connection: ${status}`;
            } else {
              window['connectionAttempts'] = 0;
            }
          } else {
            const att = document.querySelectorAll('._2Nr6U');
            if (att.length) {
              if (window['connectionAttempts'] >= attempts) {
                window.location.reload();
                window['connectionAttempts'] = 0;
                return true;
              }
              window['connectionAttempts']++;
              return `Number of attempts ${window['connectionAttempts']} of ${attempts}, status connection: Not Defined`;
            }
          }
        }, attempts)
        .catch(() => undefined)) as string | true;

      if (checkStatus) {
        callback(checkStatus);
      }

      await sleep(sleeps);
    }
  } catch (e) {}
}
