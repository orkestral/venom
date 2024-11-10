import { Whatsapp } from '../api/whatsapp';
import { CreateConfig, defaultOptions } from '../config/create-config';
import { initWhatsapp, initBrowser, statusLog } from './browser';
import { welcomeScreen } from './welcome';
import {
  SocketState,
  SocketStream,
  InterfaceMode,
  InterfaceState
} from '../api/model/enum';
import { InterfaceChangeMode } from '../api/model';
import { checkingCloses } from '../api/helpers';
import { Browser, Page } from 'puppeteer';
import { checkUpdates } from './check-up-to-date';

declare global {
  interface Window {
    updater;
  }
}
/**
 * A callback will be received, informing the status of the qrcode
 */
export type CatchQR = (
  qrCode: string,
  asciiQR: string,
  attempt?: number,
  urlCode?: string
) => void;

/**
 * A callback will be received, informing the customer's status
 */
export type StatusFind = (
  statusGet: string,
  session: string,
  info?: string
) => void;

/**
 * A callback will be received, informing user about browser and page instance
 */
export type BrowserInstance = (
  browser: string | Browser,
  waPage: false | Page,
  client: Whatsapp
) => void;

export type interfaceChange = (
  statusGet: InterfaceStateChange | string,
  session: string
) => void;

export enum InterfaceStateChange {
  /**
   * Client interface is loading page from qrcode
   */
  qrcodeOpening = 'qrcodeOpening',
  /**
   * Client interface is loading qrcode
   */
  qrcodeLoading = 'qrcodeLoading',
  /**
   * QR code ready to be read!
   */
  qrcodeNormal = 'qrcodeNormal',
  /**
   * Client interface is loading page from syncing
   */
  syncingOpening = 'syncingOpening',
  /**
   * Client interface is loading syncing
   */
  syncingLoading = 'syncingLoading',
  /**
   * Syncing ready to be read!
   */
  syncingNormal = 'syncingNormal',
  /**
   * The customer is in the chat
   */
  chatsAvailable = 'chatsAvailable'
}

export type ReconnectQrcode = (client: Whatsapp) => void;

export interface CreateOptions extends CreateConfig {
  /**
   * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
   */
  session: string;
  /**
   * A callback will be received, informing the status of the qrcode
   */
  catchQR?: CatchQR;
  /**
   * A callback will be received, informing the customer's status
   */
  statusFind?: StatusFind;
  /**
   * A callback will be received, informing user about browser and page instance
   */
  browserInstance?: BrowserInstance;
  /**
   * A callback will be received, customer interface information
   */
  interfaceChange?: interfaceChange;
}

/**
 * Start the bot
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */
export async function create(createOption: CreateOptions): Promise<Whatsapp>;
/**
 * Start the bot
 * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */

export async function create(
  sessionName: string,
  catchQR?: CatchQR,
  statusFind?: StatusFind,
  options?: CreateConfig,
  browserInstance?: BrowserInstance,
  reconnectQrcode?: ReconnectQrcode,
  interfaceChange?: interfaceChange
): Promise<Whatsapp>;

export async function create(
  sessionOrOption: string | CreateOptions,
  catchQR?: CatchQR,
  statusFind?: StatusFind,
  options?: CreateConfig,
  browserInstance?: BrowserInstance,
  reconnectQrcode?: ReconnectQrcode,
  interfaceChange?: interfaceChange
): Promise<any> {
  let session = 'session';
  return new Promise(async (resolve, reject) => {
    if (
      typeof sessionOrOption === 'string' &&
      sessionOrOption.replace(/\s/g, '').length
    ) {
      session = sessionOrOption.replace(/\s/g, '');
      options['session'] = session;
    } else if (typeof sessionOrOption === 'object') {
      session = sessionOrOption.session || session;
      catchQR = sessionOrOption.catchQR || catchQR;
      statusFind = sessionOrOption.statusFind || statusFind;
      browserInstance = sessionOrOption.browserInstance || browserInstance;
      options = sessionOrOption;
    }

    console.info('Checking NodeJS version...');
    const requiredNodeVersion = 16;
    const currentNodeVersion = Number(process.versions.node.split('.')[0]);
    if (currentNodeVersion < requiredNodeVersion) {
      console.error(
        `update Node.js, the version you are using doesn't work for this system!`
      );
      return reject(
        `Outdated Node.js version. Node.js ${requiredNodeVersion} or higher is required. Please update Node.js.`
      );
    }
    console.info(`Node.js version verified successfully!`);

    await checkUpdates();

    const mergedOptions = { ...defaultOptions, ...options };

    if (!mergedOptions.disableWelcome) {
      welcomeScreen();
    }

    statusFind && statusFind('initBrowser', session);

    // Initialize whatsapp
    if (mergedOptions.browserWS) {
      console.info(`Waiting... checking the wss server...`);
    } else {
      console.info('Waiting... checking the browser...');
    }

    const browser: Browser | boolean = await initBrowser(mergedOptions);

    if (typeof browser === 'boolean') {
      console.error(`Error no open browser....`);

      statusFind && statusFind('noOpenBrowser', session);
      return reject(`Error no open browser....`);
    }

    if (mergedOptions.browserWS) {
      statusFind && statusFind('connectBrowserWs', session);
      console.info(`Has been properly connected to the wss server`);
    } else {
      statusFind && statusFind('openBrowser', session);
      console.info(`Browser successfully opened`);
    }

    if (!mergedOptions.browserWS) {
      console.info('checking headless...');

      if (mergedOptions.headless) {
        console.info('headless option is active, browser hidden');
      } else {
        console.info('headless option is disabled, browser visible');
      }
    }

    if (typeof browser === 'object') {
      if (!mergedOptions.browserWS && browser['_process']) {
        browser['_process'].once('close', () => {
          browser['isClose'] = true;
        });
      }

      checkingCloses(browser, mergedOptions, (result) => {
        statusFind && statusFind(result, session);
      }).catch(() => {
        console.error('Closed Browser');
        return reject('The client has been closed');
      });

      console.info('Checking page to whatzapp...');

      statusFind && statusFind('initWhatsapp', session);
      // Initialize whatsapp
      const page: false | Page = await initWhatsapp(mergedOptions, browser);

      if (page === false) {
        console.error('Error accessing the page: "https://web.whatsapp.com"');
        statusFind && statusFind('erroPageWhatsapp', session);
        return reject(
          'Error when trying to access the page: "https://web.whatsapp.com"'
        );
      }

      statusFind && statusFind('successPageWhatsapp', session);

      console.info('Page successfully accessed');
      console.info('waiting for introduction');

      statusLog(page, session, (event) => {
        console.info(event);
        statusFind && statusFind('introductionHistory', session, event);
      });

      const client = new Whatsapp(browser, page, session, mergedOptions);

      if (browserInstance) {
        browserInstance(browser, page, client);
      }

      client.onInterfaceChange(async (interFace: InterfaceChangeMode) => {
        try {
          if (interFace.mode === InterfaceMode.MAIN) {
            interfaceChange && interfaceChange('chatsAvailable', session);
            console.info('opening main page...');
            console.info('Successfully main page!');
            console.info('Successfully sync!');

            await client.initService();
            await client.addChatWapi();
          }

          if (interFace.mode === InterfaceMode.SYNCING) {
            if (interFace.info === InterfaceState.OPENING) {
              interfaceChange && interfaceChange('syncingOpening', session);
              console.info('opening sync page...');
            }

            if (interFace.info === InterfaceState.PAIRING) {
              interfaceChange && interfaceChange('syncingLoading', session);
              console.info('Loading sync');
            }

            if (interFace.info === InterfaceState.NORMAL) {
              interfaceChange && interfaceChange('syncingNormal', session);
              console.info('Successfully sync!');
            }
          }

          if (interFace.mode === InterfaceMode.QR) {
            const status = await page.evaluate(
              () => window?.Store?.State?.Socket?.stream
            );
            if (status === SocketStream.DISCONNECTED) {
              console.info(`${session} was disconnected`);
              document.querySelectorAll('.MLTJU p')[0].textContent;
              statusFind && statusFind('desconnected', session);
            }

            if (interFace.info === InterfaceState.OPENING) {
              interfaceChange && interfaceChange('qrcodeOpening', session);
              console.info(`${session}:  Opening QR Code...`);
            }

            if (interFace.info === InterfaceState.PAIRING) {
              interfaceChange && interfaceChange('qrcodeLoading', session);
              console.info(`${session}:  Loading QR Code...`);
            }

            if (interFace.info === InterfaceState.NORMAL) {
              interfaceChange && interfaceChange('qrcodeNormal', session);
              console.info(`${session}:  Successfully loaded QR Code!`);
            }
          }
        } catch {}
      });

      client
        .onStreamChange(async (stateStream: SocketStream) => {
          if (stateStream === SocketStream.CONNECTED) {
            console.info(`${session}: Successfully connected!`);
          }

          if (stateStream === SocketStream.DISCONNECTED) {
            const mode = await page
              .evaluate(() => window?.Store?.Stream?.mode)
              .catch(() => {});
            if (mode === InterfaceMode.QR) {
              if (statusFind) {
                statusFind('desconnectedMobile', session);
                console.error(`${session}: Disconnected by phone`);
              }
            }
          }
        })
        .catch();

      client
        .onStateChange(async (state) => {
          if (state === SocketState.PAIRING) {
            const device: Boolean = await page
              .evaluate(() => {
                if (
                  document.querySelector('[tabindex="-1"]') &&
                  window?.Store?.Stream?.mode === InterfaceMode.SYNCING &&
                  window?.Store?.Stream?.obscurity === 'SHOW'
                ) {
                  return true;
                }
                return false;
              })
              .catch(() => undefined);
            if (device === true) {
              if (statusFind) {
                statusFind('deviceNotConnected', session);
              }
            }
          }
        })
        .catch();

      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      if (mergedOptions.waitForLogin) {
        const isLogged = await client
          .waitForLogin(catchQR, statusFind)
          .catch(() => undefined);

        statusFind && statusFind('waitForLogin', session);

        if (!isLogged) {
          return reject('Not Logged');
        }

        let waitLoginPromise = null;
        client
          .onStateChange(async (state) => {
            if (
              state === SocketState.UNPAIRED ||
              state === SocketState.UNPAIRED_IDLE
            ) {
              if (!waitLoginPromise) {
                waitLoginPromise = client
                  .waitForLogin(catchQR, statusFind)
                  .then(() => {
                    if (reconnectQrcode) {
                      reconnectQrcode(client);
                    }
                  })
                  .catch(() => {})
                  .finally(() => {
                    waitLoginPromise = null;
                  });
              }
              await waitLoginPromise;
            }
          })
          .catch();
      }

      statusFind && statusFind('waitChat', session);

      await page
        .waitForSelector('#app .two', { visible: true })
        .catch(() => {});

      console.info(`${session}: Successfully connected`);

      await client.initService();
      await client.addChatWapi();

      statusFind && statusFind('successChat', session);

      return resolve(client);
    }
  });
}
