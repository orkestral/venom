import { Whatsapp } from '../api/whatsapp';
import { CreateConfig, defaultOptions } from '../config/create-config';
import { initWhatsapp, initBrowser, statusLog } from './browser';
import { welcomeScreen } from './welcome';
import { getSpinnies } from '../utils/spinnies';
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
    } else if (typeof sessionOrOption === 'object') {
      session = sessionOrOption.session || session;
      catchQR = sessionOrOption.catchQR || catchQR;
      statusFind = sessionOrOption.statusFind || statusFind;
      browserInstance = sessionOrOption.browserInstance || browserInstance;
      options = sessionOrOption;
    }

    const requiredNodeVersion = 16;
    const currentNodeVersion = Number(process.versions.node.split('.')[0]);
    if (currentNodeVersion < requiredNodeVersion) {
      return reject(
        `Outdated Node.js version. Node.js ${requiredNodeVersion} or higher is required. Please update Node.js.`
      );
    }

    await checkUpdates();

    const spinnies = getSpinnies({
      disableSpins: options ? options.disableSpins : false
    });

    const mergedOptions = { ...defaultOptions, ...options };

    if (!mergedOptions.disableWelcome) {
      welcomeScreen();
    }

    statusFind && statusFind('initBrowser', session);

    // Initialize whatsapp
    if (mergedOptions.browserWS) {
      spinnies.add(`browser-${session}`, {
        text: `Waiting... checking the wss server...`
      });
    } else {
      spinnies.add(`browser-${session}`, {
        text: 'Waiting... checking the browser...'
      });
    }

    const browser: Browser | boolean = await initBrowser(mergedOptions);

    if (typeof browser === 'boolean') {
      spinnies.fail(`browser-${session}`, {
        text: `Error no open browser....`
      });
      statusFind && statusFind('noOpenBrowser', session);
      return reject(`Error no open browser....`);
    }

    if (mergedOptions.browserWS) {
      statusFind && statusFind('connectBrowserWs', session);
      spinnies.succeed(`browser-${session}`, {
        text: `Has been properly connected to the wss server`
      });
    } else {
      statusFind && statusFind('openBrowser', session);
      spinnies.succeed(`browser-${session}`, {
        text: `Browser successfully opened`
      });
    }

    if (!mergedOptions.browserWS) {
      spinnies.add(`browser-${session}`, {
        text: 'checking headless...'
      });

      if (mergedOptions.headless) {
        spinnies.succeed(`browser-${session}`, {
          text: 'headless option is active, browser hidden'
        });
      } else {
        spinnies.succeed(`browser-${session}`, {
          text: 'headless option is disabled, browser visible'
        });
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
        spinnies.fail(`whatzapp-${session}-close`, {
          text: 'Closed Browser'
        });
        return reject('The client has been closed');
      });

      spinnies.add(`whatzapp-${session}`, {
        text: 'Checking page to whatzapp...'
      });

      statusFind && statusFind('initWhatsapp', session);
      // Initialize whatsapp
      const page: false | Page = await initWhatsapp(mergedOptions, browser);

      if (page === false) {
        spinnies.fail(`whatzapp-${session}`, {
          text: 'Error accessing the page: "https://web.whatsapp.com"'
        });
        statusFind && statusFind('erroPageWhatsapp', session);
        return reject(
          'Error when trying to access the page: "https://web.whatsapp.com"'
        );
      }

      statusFind && statusFind('successPageWhatsapp', session);

      spinnies.succeed(`whatzapp-${session}`, {
        text: 'Page successfully accessed'
      });

      try {
        spinnies.add(`whatzapp-intro-${session}`, {
          text: 'waiting for introduction'
        });
      } catch {}

      statusLog(page, spinnies, session, (event) => {
        try {
          spinnies.add(`whatzapp-intro-${session}`, {
            text: event
          });
        } catch {}
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
            spinnies.add(`whatzapp-mode-main-${session}`, {
              text: 'opening main page...'
            });

            spinnies.succeed(`whatzapp-mode-main-${session}`, {
              text: 'Successfully main page!'
            });

            spinnies.succeed(`whatzapp-mode-syncing-${session}`, {
              text: 'Successfully sync!'
            });

            await client.initService();
            await client.addChatWapi();
          }

          if (interFace.mode === InterfaceMode.SYNCING) {
            if (interFace.info === InterfaceState.OPENING) {
              interfaceChange && interfaceChange('syncingOpening', session);
              spinnies.add(`whatzapp-mode-syncing-${session}`, {
                text: 'opening sync page...'
              });
            }

            if (interFace.info === InterfaceState.PAIRING) {
              interfaceChange && interfaceChange('syncingLoading', session);
              spinnies.add(`whatzapp-mode-syncing-${session}`, {
                text: 'Loading sync...'
              });
            }

            if (interFace.info === InterfaceState.NORMAL) {
              interfaceChange && interfaceChange('syncingNormal', session);
              spinnies.succeed(`whatzapp-mode-syncing-${session}`, {
                text: 'Successfully sync!'
              });
            }
          }

          if (interFace.mode === InterfaceMode.QR) {
            const status = await page.evaluate(
              () => window?.Store?.State?.Socket?.stream
            );
            if (status === SocketStream.DISCONNECTED) {
              spinnies.add(`whatzapp-disconnected-${session}`, {
                text: 'checking...'
              });

              spinnies.fail(`whatzapp-disconnected-${session}`, {
                text: 'Was disconnected!'
              });
              statusFind && statusFind('desconnected', session);
            }

            if (interFace.info === InterfaceState.OPENING) {
              interfaceChange && interfaceChange('qrcodeOpening', session);
              spinnies.add(`whatzapp-mode-qr-${session}`, {
                text: 'Opening QR Code page...'
              });
            }

            if (interFace.info === InterfaceState.PAIRING) {
              interfaceChange && interfaceChange('qrcodeLoading', session);
              spinnies.add(`whatzapp-mode-qr-${session}`, {
                text: 'Loading QR Code...'
              });
            }

            if (interFace.info === InterfaceState.NORMAL) {
              interfaceChange && interfaceChange('qrcodeNormal', session);
              spinnies.succeed(`whatzapp-mode-qr-${session}`, {
                text: 'Successfully loaded QR Code!'
              });
            }
          }
        } catch {}
      });

      client
        .onStreamChange(async (stateStream: SocketStream) => {
          if (stateStream === SocketStream.CONNECTED) {
            try {
              spinnies.succeed(`whatzapp-intro-${session}`, {
                text: 'Successfully connected!'
              });
            } catch {}
          }

          if (stateStream === SocketStream.DISCONNECTED) {
            const mode = await page
              .evaluate(() => window?.Store?.Stream?.mode)
              .catch(() => {});
            if (mode === InterfaceMode.QR) {
              if (statusFind) {
                spinnies.add(`whatzapp-qr-${session}`, {
                  text: 'check....'
                });
                statusFind('desconnectedMobile', session);
                spinnies.fail(`whatzapp-qr-${session}`, {
                  text: 'Disconnected by cell phone!'
                });
              }
            }
          }
        })
        .catch();

      client
        .onStateChange(async (state) => {
          if (state === SocketState.PAIRING) {
            if (statusFind) {
              statusFind('deviceNotConnected', session);
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

      await client.initService();
      await client.addChatWapi();

      statusFind && statusFind('successChat', session);

      return resolve(client);
    }
  });
}
