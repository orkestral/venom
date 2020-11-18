import { Browser, Page } from 'puppeteer';
import Spinnies = require('spinnies');
import { CreateConfig } from '../config/create-config';
import { asciiQr, retrieveQR, checkWebpackJsonp, checkDeleteToken, stateInject } from './auth';
import { scrapeImgReload, scrapeImg, deleteFiles, injectState, webpackJsonpWI } from '../api/helpers';
import { writeFileSync, mkdir} from 'fs';
import { injectApi } from './browser';
import path = require('path');

export class constructConn {
    public connect: boolean;
    constructor(value: boolean) {
      this.connect = value;
    }
    get getConnet(): boolean {
      return this.connect;
    }
    set setConnet(value: boolean) {
      this.connect = value;
    }
}
  
/**
 * delete token
 */
export async function deleteToken(
    waPage: Page, 
    Session: string,
    mergedOptions: CreateConfig,
    spinnies: Spinnies,
    callDelToken?: (paran: boolean) => void
    ): Promise<Boolean> {
    var checkDelete = await checkDeleteToken(waPage).toPromise();
    if (checkDelete === true) {
      deleteFiles(mergedOptions, Session, spinnies);
      if (callDelToken) {
        callDelToken(checkDelete);
      }
      return checkDelete;
    }
}

/**
 * Save token
 */
export async function tokenSave(
    spinnies: Spinnies,
    mergedOptions: CreateConfig,
    browserToken: object,
    Session: string,
    waPage: Page,
    returnToken: (
      token: object,
      session: string,
    ) => void
  ) {
  
    spinnies.add(`${Session}-inject`, {
      text: 'Injecting Sibionte...'
    });
  
    waPage = await injectApi(waPage);
  
    spinnies.succeed(`${Session}-inject`, {
      text: 'Starting With Success!',
    });
  
    // Saving Token
    if (mergedOptions.saveToken === true) {
      spinnies.add(`${Session}-inject`, {
        text: 'Saving Token...'
      });
    } else {
      spinnies.add(`${Session}-inject`, {
        text: 'Token saving disabled...'
      });
    }
  
    if (true || (browserToken && !mergedOptions.createPathFileToken)) {
      spinnies.add(`${Session}-inject`, {
        text: 'Get token.'
      });
  
      var token: string = await waPage.evaluate(() => {
        if (!!window.localStorage) {
          return JSON.stringify(window.localStorage);
        }
      })
  
      if (token) {
        const localStorage = JSON.parse(token);
  
        let {
          WABrowserId,
          WASecretBundle,
          WAToken1,
          WAToken2,
        } = localStorage;
  
        if (returnToken) {
          returnToken({ WABrowserId, WASecretBundle, WAToken1, WAToken2 }, Session);
        }
  
        if (mergedOptions.saveToken === true) {
          try {
            setTimeout(() => {
              mkdir(
                path.join(
                  path.resolve(
                    process.cwd() + mergedOptions.mkdirFolderToken,
                    mergedOptions.folderNameToken
                  )
                ),
                { recursive: true },
                (err) => {
                  if (err) {
                    spinnies.fail(`${Session}-inject`, {
                      text: 'Failed to create folder tokens...',
                    });
                  }
                }
              );
            }, 200);
  
            setTimeout(() => {
              writeFileSync(
                path.join(
                  path.resolve(
                    process.cwd() + mergedOptions.mkdirFolderToken,
                    mergedOptions.folderNameToken
                  ),
                  `${Session}.data.json`
                ),
                JSON.stringify({
                  WABrowserId,
                  WASecretBundle,
                  WAToken1,
                  WAToken2,
                })
              );
              spinnies.succeed(`${Session}-inject`, {
                text: 'Token saved successfully...',
              });
            }, 500);
          } catch (error) {
            spinnies.fail(`${Session}-inject`, {
              text: `Failed to save token... ${error}`,
            });
          }
        }
      }
    }
  
}

/**
 * useHere
 */
export async function useHere(
    wapage: Page,
    Session: string,
    statusUseHere: (
      statusGet: string,
      session: string
    ) => void
  ) {
    var results: boolean = await wapage.evaluate(async () => {
      // @ts-ignore
      return await window.WAPI.takeOver();
    });
    if (results === true) {
      if (statusUseHere) {
        statusUseHere("useherecalled", Session);
      }
    }
}

/**
* Scrape QRCODE
*/
export function scrapQrcodeTime(
    intervalScrapeQrcode: NodeJS.Timeout,
    mergedOptions: CreateConfig,
    spinnies: Spinnies,
    browser: Browser,
    waPage: Page,
    Session: string,
    AutoCloseBrowser: NodeJS.Timeout,
    disconnectOrClose: NodeJS.Timeout,
    statusF: (
      statusGet: string,
      session: string
    ) => void,
    catQR: (
      qrCode: string,
      asciiQR: string,
      attempt: number
    ) => void,
  
  ): NodeJS.Timeout {
  
    clearInterval(intervalScrapeQrcode);
  
    if (statusF) {
      statusF("returnQrcode", Session);
    }
  
    let tipo_qr: number = 0, attempt: number = 0, result = undefined, url = null;
  
    // Scraper qrcode
    intervalScrapeQrcode = setInterval(async () => {
      // Close client browser
      if (
        browser['isClose'] != undefined ||
        browser.isConnected() === false
      ) {
        if (statusF) {
          statusF('qrReadFail', Session);
        }
        clearInterval(intervalScrapeQrcode);
      } else {
        switch (tipo_qr) {
          case 0:
            result = await scrapeImg(waPage).catch(() => { });
            if (result != undefined) {
              var retri = await retrieveQR(waPage).catch(() => { });
              if (retri) {
                var { data, asciiQR } = retri;
                if (catQR) {
                  catQR(data, asciiQR, attempt++);
                }
                await asciiQr(result['url'])
                  .then((qr) => {
                    if (mergedOptions.logQR) {
                      console.log(`\n${qr}\n`);
                    }
                    tipo_qr++;
                  })
                  .catch(() => { });
              }
            }
            break;
          case 1:
            result = await scrapeImgReload(waPage, url).catch(() => { });
            if (typeof result === 'object') {
              url = result.url;
            }
            if (typeof result === 'object' && result.status === true) {
              let re = await scrapeImg(waPage).catch(() => { });
              if (re != undefined) {
                var retri = await retrieveQR(waPage).catch(() => { });
                if (retri) {
                  var { data, asciiQR } = retri;
                  if (catQR) {
                    catQR(data, asciiQR, attempt++);
                  }
                  await asciiQr(re['url'])
                    .then((qr) => {
                      if (mergedOptions.logQR) {
                        console.log(`\n${qr}\n`);
                      }
                    })
                    .catch(() => { });
                }
              }
            }
            break;
        }
      }
    }, 1000);
    return intervalScrapeQrcode;
}

/**
 * AutoClose
 */
export function autoCloseF(
    AutoCloseBrowser: NodeJS.Timeout,
    mergedOptions: CreateConfig,
    spinnies: Spinnies,
    disconnectOrClose: NodeJS.Timeout,
    intervalScrapeQrcode: NodeJS.Timeout,
    Session: string,
    browser: Browser,
    typeClose: string,
    statusFc: (
      statusGet: string,
      session: string
    ) => void,
  ): NodeJS.Timeout {
  
    clearTimeout(AutoCloseBrowser);
  
    let time = void 0;
  
    spinnies.add(`${Session}-autoclose`, {
      text: `check autoclose...`,
    });
  
    if (typeClose === "PAIRING") {
      time = mergedOptions.autoClosePairing;
    }
  
    if (typeClose === "UNPAIRED") {
      time = mergedOptions.autoClose;
    }
  
    if (time > 0) {
      if (typeClose === "UNPAIRED") {
        spinnies.succeed(`${Session}-autoclose`, {
          text: `the autoClose function is on time: ${time}`,
        });
      }
  
      if (typeClose === "PAIRING") {
        spinnies.succeed(`${Session}-autoclose`, {
          text: `the autoClosePairing function is on time: ${time}`,
  
        });
      }
  
      AutoCloseBrowser = setTimeout(() => {
        browser.disconnect();
        browser.close();
  
        if (typeClose === "UNPAIRED") {
          if (statusFc) {
            statusFc("autocloseCalled", Session);
          }
        }
  
        if (typeClose === "PAIRING") {
          if (statusFc) {
            statusFc("autoclosePairingCalled", Session);
          }
        }
  
        spinnies.add(`${Session}-autoclose`, {
          text: `....`,
        });
  
        if (typeClose === "UNPAIRED") {
          spinnies.succeed(`${Session}-autoclose`, {
            text: `Session Autoclose Called`,
          });
        }
  
        if (typeClose === "PAIRING") {
          spinnies.succeed(`${Session}-autoclose`, {
            text: `Session Autoclose Pairing Called`,
  
          });
        }
        clearInterval(intervalScrapeQrcode);
      },
        time
      );
    } else {
  
      if (typeClose === "UNPAIRED") {
        spinnies.succeed(`${Session}-autoclose`, {
          text: 'the autoClose function is off ',
        });
      }
  
      if (typeClose === "PAIRING") {
        spinnies.succeed(`${Session}-autoclose`, {
          text: 'the autoClosePairing function is off ',
        });
      }
  
    }
    return AutoCloseBrowser;
}

/**
 * scrape inject state
 */
export async function scrapeWebpackJsonp(
    waPage: Page,
    AutoCloseBrowser: NodeJS.Timeout,
    spinnies: Spinnies,
    disconnectOrClose: NodeJS.Timeout,
    intervalScrapeQrcode: NodeJS.Timeout,
    Session: string,
    browser: Browser,
    mergedOptions: CreateConfig,
    browserToken: object,
    conn: constructConn,
    statusWS: (
      status: string,
      session: string
    )
      => void,
    callqr: (
      callCode: string,
      callciiQR: string,
      callattempt: number
    ) => void,
    callState: (
      state: string,
      session: string
    ) => void,
    callToken: (
      token: object,
      session: string
    ) => void
  ): Promise<any> {
  
    conn.setConnet = true;
    let UNP: boolean = true;
  
    return new Promise(async (resolve) => {
      try {
        spinnies.add(`${Session}-jsonp`, {
          text: 'Wait injecting state...',
        });
        var ch = await checkWebpackJsonp(waPage).toPromise();
        if (ch) {
          var inj = await injectState(waPage);
          if (inj === true) {
            spinnies.succeed(`${Session}-jsonp`, {
              text: 'Successfully injected state'
            });
          }
        }
      } catch {
        spinnies.fail(`${Session}-jsonp`, {
          text: 'Fail injected state'
        });
      }
  
      spinnies.add(`${Session}-jsonp`, {
        text: 'check injecting state...',
      });
  
      var inject = await stateInject(waPage).toPromise();
  
      if (inject === true) {
  
        spinnies.succeed(`${Session}-jsonp`, {
          text: 'State complete...',
        });
  
        await webpackJsonpWI(waPage, async (state: string) => {
  
          if (callState) {
            callState(state, Session);
          }
  
          if (state === "PAIRING" && !await checkInterface(waPage)) {
            AutoCloseBrowser = autoCloseF(
              AutoCloseBrowser,
              mergedOptions,
              spinnies,
              disconnectOrClose,
              intervalScrapeQrcode,
              Session,
              browser,
              "PAIRING",
              (statusGet, session) => {
                if (statusWS) {
                  statusWS(statusGet, Session);
                }
              }
            );
          }
  
          if (state === "UNPAIRED") {
            deleteFiles(
              mergedOptions,
              Session,
              spinnies
            );
  
            if (statusWS) {
              statusWS('notLogged', Session)
            }
            spinnies.add(`${Session}-autoclose`, {
              text: 'check autoClose...'
            });
  
            //check options autoclose 
            AutoCloseBrowser = autoCloseF(
              AutoCloseBrowser,
              mergedOptions,
              spinnies,
              disconnectOrClose,
              intervalScrapeQrcode,
              Session,
              browser,
              "UNPAIRED",
              (statusGet, session) => {
                if (statusWS) {
                  statusWS(statusGet, Session);
                }
              }
            );
  
            intervalScrapeQrcode = scrapQrcodeTime(
              intervalScrapeQrcode,
              mergedOptions,
              spinnies,
              browser,
              waPage,
              Session,
              AutoCloseBrowser,
              disconnectOrClose,
              (statusGet, session) => {
                if (statusWS) {
                  statusWS(statusGet, Session);
                }
              },
              (qrCode, asciiQR, attempt) => {
                if (callqr) {
                  callqr(qrCode, asciiQR, attempt);
                }
              },
            );
          }
  
          if (state === "CONFLICT" && mergedOptions.usehere === true) {
            await useHere(
              waPage,
              Session,
              (statusGet, session) => {
                statusWS(statusGet, Session);
              });
          }
  
          if (state === "CONNECTED") {
            if (statusWS) {
              statusWS('isLogged', Session);
            }
            clearTimeout(AutoCloseBrowser);
            clearInterval(intervalScrapeQrcode);
          }
  
          if (state === "CONNECTED" && conn.getConnet === true) {
            if (statusWS) {
              statusWS('isLogged', Session);
            }
            await tokenSave(
              spinnies,
              mergedOptions,
              browserToken,
              Session,
              waPage,
              (token, session) => {
                callToken(token, session);
              }
            );
            conn.setConnet = false;
            return resolve(true);
          }
  
        });
  
        if (UNP) {
          await waPage.evaluate(() => {
             // @ts-ignore
            window.injects(window.inject.default.state);
          });
          UNP = !UNP;
        }
  
      }
    });
  

}

/**
 * check Interface login
 */
export async function checkInterface(waPage: Page): Promise<boolean>{
 return await waPage.evaluate(() => {
      if(
      (document.getElementsByClassName('app')[0] &&
      document.getElementsByClassName('app')[0].attributes &&
      !!document.getElementsByClassName('app')[0].attributes["tabindex"]) || 
      (document.getElementsByClassName('two')[0] && 
      document.getElementsByClassName('two')[0].attributes && 
      !!document.getElementsByClassName('two')[0].attributes["tabindex"])){
          return !0;
      }else{
          return !1;
      }
  });

}