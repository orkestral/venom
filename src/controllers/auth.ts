import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { existsSync, readFileSync } from 'fs';
import { CreateConfig } from '../config/create-config';
import { ScrapQrcode } from '../api/model/qrcode';
import { tokenSession } from '../config/tokenSession.config';

export const getInterfaceStatus = async (
  waPage: puppeteer.Page
): Promise<string | null | boolean> => {
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

        const streamStatus =
          window['Store'] &&
          window['Store'].Stream &&
          window['Store'].Stream.displayInfo;

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
        polling: 100,
      }
    )
    .then(async (element) => {
      return await element
        .evaluate((a) => {
          return a;
        })
        .catch(() => {});
    })
    .catch((e) => e);
};

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
    qrcode.generate(code, { small: true }, (qrcode) => {
      resolve(qrcode);
    });
  });
}

export async function retrieveQR(
  page: puppeteer.Page
): Promise<ScrapQrcode | undefined> {
  const hasCanvas = await page.evaluate(
    () => document.querySelector('canvas') !== null
  );

  if (!hasCanvas) {
    return undefined;
  }

  await page.addScriptTag({
    path: require.resolve(path.join(__dirname, '../lib/jsQR', 'jsQR.js')),
  });

  return await page
    .evaluate(() => {
      const canvas = document.querySelector('canvas') || null;
      if (canvas !== null) {
        const context = canvas.getContext('2d') || null;
        if (context !== null) {
          // @ts-ignore
          const code = jsQR(
            context.getImageData(0, 0, canvas.width, canvas.height).data,
            canvas.width,
            canvas.height
          );
          return { urlCode: code.data, base64Image: canvas.toDataURL() };
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

  //Auth with token ->start<-
  await page.evaluate((session) => {
    localStorage.clear();
    Object.keys(session).forEach((key) => {
      localStorage.setItem(key, session[key]);
    });
  }, token as any);
  //End Auth with token
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
          WAToken2: window.localStorage.getItem('WAToken2'),
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
      process.cwd() + options.mkdirFolderToken,
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
    fs.chmodSync(folder, '777');
    fs.chmodSync(folder + '/' + session + '.data.json', '777');
  } catch (error) {
    throw 'Failed to save token...';
  }

  return token;
}
