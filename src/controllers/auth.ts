import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { existsSync, readFileSync } from 'fs';
import { CreateConfig } from '../config/create-config';
import { ScrapQrcode } from '../api/model/qrcode';
import { tokenSession } from '../config/tokenSession.config';
//import { InterfaceMode } from '../api/model/enum/interface-mode';
//import { injectApi } from './browser';
import { sleep } from '../utils/sleep';
import { Whatsapp } from '../api/whatsapp';
const QRCode = require('qrcode');

export const getInterfaceStatus = async (waPage: puppeteer.Page) => {
  return await waPage
    .waitForFunction(
      () => {
        const erroHTTP = document.querySelector('.error-code');
        if (erroHTTP && erroHTTP[0].innerText.includes('HTTP ERROR 429')) {
          return { type: erroHTTP[0].innerText };
        }
        const elLoginWrapper = document.querySelector(
          'body > div > div > .landing-wrapper'
        );
        const elQRCodeCanvas = document.querySelector('canvas');
        if (elLoginWrapper && elQRCodeCanvas) {
          return 'UNPAIRED';
        }

        const streamStatus = window?.Store?.Stream?.displayInfo;

        if (['PAIRING', 'RESUMING', 'SYNCING'].includes(streamStatus)) {
          return 'PAIRING';
        }

        const chat = document.querySelector('.app, .two') as HTMLDivElement;
        if (chat && chat.attributes && chat.tabIndex) {
          return 'CONNECTED';
        }
        return false;
      },
      {
        timeout: 0,
        polling: 100
      }
    )
    .then(async (element: any) => {
      return await element
        .evaluate((a: any) => {
          return a;
        })
        .catch(() => undefined);
    })
    .catch(() => undefined);
};

// };

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);

  if (typeof status === 'object') {
    return status;
  }

  if (typeof status !== 'string') {
    return null;
  }
  return ['CONNECTED', 'PAIRING'].includes(status);
};

export const needsToScan = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }
  return status === 'UNPAIRED';
};

export const isInsideChats = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return status === 'CONNECTED';
};

export const isConnectingToPhone = async (waPage: puppeteer.Page) => {
  const status = await getInterfaceStatus(waPage);
  if (typeof status !== 'string') {
    return null;
  }

  return status === 'PAIRING';
};

export async function asciiQr(code: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      qrcode.generate(code, { small: true }, (qrcode) => {
        resolve(qrcode);
      });
    } catch (e) {}
  });
}

export async function retrieveQR(
  page: puppeteer.Page
): Promise<ScrapQrcode | undefined> {
  const hasCanvas = await page
    .evaluate(() => {
      const buttonReload = document.querySelector('button');
      const canvas = document.querySelector('canvas');
      if (canvas !== null && buttonReload === null) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => undefined);

  if (hasCanvas === false) {
    return undefined;
  }

  await page
    .addScriptTag({
      path: require.resolve(path.join(__dirname, '../lib/jsQR', 'jsQR.js'))
    })
    .catch(() => undefined);

  return await page
    .evaluate(() => {
      const buttonReload = document.querySelector('button');
      const canvas = document.querySelector('canvas') || null;
      if (canvas !== null && buttonReload === null) {
        const context = canvas.getContext('2d') || null;
        if (context !== null && buttonReload === null) {
          // @ts-ignore
          const code = jsQR(
            context.getImageData(0, 0, canvas.width, canvas.height).data,
            canvas.width,
            canvas.height
          );

          return {
            urlCode: code.data ? code.data : '',
            base64Image: canvas.toDataURL()
          };
        }
      }
      return undefined;
    })
    .catch(() => undefined);
}

export function SessionTokenCkeck(token: object) {
  if (
    token &&
    token['WABrowserId'] &&
    token['WASecretBundle'] &&
    token['WAToken1'] &&
    token['WAToken2']
  ) {
    return true;
  } else {
    return false;
  }
}

export async function auth_InjectToken(
  page: puppeteer.Page,
  session: string,
  options: CreateConfig,
  token?: tokenSession
) {
  if (!token) {
    const pathToken: string = path.join(
      path.resolve(
        process.cwd() + options.mkdirFolderToken,
        options.folderNameToken
      ),
      `${session}.data.json`
    );
    if (existsSync(pathToken)) {
      token = JSON.parse(readFileSync(pathToken).toString());
    }
  }

  if (!token || !SessionTokenCkeck(token)) {
    return false;
  }

  await page
    .evaluate((session) => {
      localStorage.clear();
      Object.keys(session).forEach((key) => {
        localStorage.setItem(key, session[key]);
      });
    }, token as any)
    .catch();
}

export async function isClassic(page: puppeteer.Page): Promise<Boolean> {
  return await page
    .evaluate(() => {
      if (
        window.localStorage.getItem('WASecretBundle') &&
        window.localStorage.getItem('WAToken1') &&
        window.localStorage.getItem('WAToken2')
      ) {
        return true;
      }
      return false;
    })
    .catch(() => undefined);
}

export async function saveToken(
  page: puppeteer.Page,
  session: string,
  options: CreateConfig
) {
  const token = (await page
    .evaluate(() => {
      if (window.localStorage) {
        return {
          WABrowserId: window.localStorage.getItem('WABrowserId'),
          WASecretBundle: window.localStorage.getItem('WASecretBundle'),
          WAToken1: window.localStorage.getItem('WAToken1'),
          WAToken2: window.localStorage.getItem('WAToken2')
        };
      }
      return undefined;
    })
    .catch(() => undefined)) as tokenSession;

  if (!token || !SessionTokenCkeck(token)) {
    return false;
  }

  const folder = path.join(
    path.resolve(
      process.cwd(),
      options.mkdirFolderToken,
      options.folderNameToken
    )
  );

  try {
    fs.mkdirSync(folder, { recursive: true });
  } catch (error) {
    throw 'Failed to create folder tokens...';
  }

  try {
    fs.writeFileSync(
      path.join(folder, `${session}.data.json`),
      JSON.stringify(token)
    );
    //fs.chmodSync(folder, '777');
    //fs.chmodSync(folder + '/' + session + '.data.json', '777');
  } catch (error) {
    throw 'Failed to save token...';
  }

  return token;
}

// export async function resetStore(page: puppeteer.Page) {
//   await page
//     .evaluate(() => {
//       let last = window['webpackChunkwhatsapp_web_client'].length - 1;
//       window['webpackChunkwhatsapp_web_client'][last][0] = [];
//       window.Store = undefined;
//       window.WAPI = undefined;
//     })
//     .catch(() => {});
// }

export async function checkDisconnect(page: puppeteer.Page, wpp: Whatsapp) {
  while (true) {
    const erroBrowser = await page
      .evaluate(() => {
        const WebEncKeySalt = localStorage.getItem('WebEncKeySalt');
        const WANoiseInfo = localStorage.getItem('WANoiseInfo');
        if (WebEncKeySalt === null && WANoiseInfo === null) {
          return true;
        }
        return false;
      })
      .catch(() => {});

    if (erroBrowser) {
      await wpp.delProfile();
    }
    await sleep(100);
  }
}

export async function checkStore(page: puppeteer.Page, client: Whatsapp) {
  while (true) {
    const result = await page
      .evaluate(() => {
        const checkStore =
          typeof window.Store !== 'undefined'
            ? Object.keys(window.Store).length
            : undefined;
        if (!checkStore || !window.WAPI) {
          if (
            window['webpackChunkwhatsapp_web_client'] &&
            Array.isArray(window['webpackChunkwhatsapp_web_client'])
          ) {
            let last = window['webpackChunkwhatsapp_web_client'].length - 1;
            let check =
              window['webpackChunkwhatsapp_web_client'] &&
              window['webpackChunkwhatsapp_web_client'][last] &&
              window['webpackChunkwhatsapp_web_client'][last][0]
                ? []
                : undefined;
            if (check !== undefined) {
              window.Store = undefined;
              window.WAPI = undefined;
              return false;
            }
          }
        }
        return true;
      })
      .catch(() => {});

    if (result === false) {
      await client.initService();
      // await injectApi(page).catch(() => {});
    }
    await sleep(100);
  }
}
