import * as ChromeLauncher from 'chrome-launcher';
import * as fs from 'fs';
import * as path from 'path';
import { Browser, BrowserContext, Page, LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin = require('puppeteer-extra-plugin-stealth');
import { useragentOverride } from '../config/WAuserAgente';
import { sleep } from '../utils/sleep';
import * as Spinnies from 'spinnies';
import * as os from 'os';
import * as rimraf from 'rimraf';
export async function initWhatsapp(
  options: CreateConfig,
  browser: Browser
): Promise<false | Page> {
  const waPage: Page = await getWhatsappPage(browser);
  if (waPage != null) {
    try {
      await waPage.setUserAgent(useragentOverride);
      if (
        typeof options.userPass === 'string' &&
        options.userPass.length &&
        typeof options.userProxy === 'string' &&
        options.userProxy.length &&
        Array.isArray(options.addProxy) &&
        options.addProxy.length
      ) {
        await waPage.authenticate({
          username: options.userProxy,
          password: options.userPass
        });
      }
      await waPage.goto(puppeteerConfig.whatsappUrl, {
        waitUntil: 'domcontentloaded'
      });

      waPage.on('pageerror', ({ message }) => {
        const erroLog = message.includes('RegisterEffect is not a function');
        if (erroLog) {
          waPage.evaluate(() => {
            localStorage.clear();
            window.location.reload();
          });
        }
      });

      await browser.userAgent();

      return waPage;
    } catch (e) {
      waPage.close().catch(() => {});
      browser.close().catch(() => {});
      return false;
    }
  }
}

export async function statusLog(
  page: Page,
  spinnies: Spinnies,
  session: string,
  callback: (infoLog: string) => void
) {
  while (true) {
    if (page.isClosed()) {
      try {
        spinnies.fail(`whatzapp-intro-${session}`, {
          text: 'Erro intro'
        });
      } catch {}
      break;
    }

    const infoLog: string = await page
      .evaluate(() => {
        const target = document.getElementsByClassName('_2dfCc');
        if (target && target.length) {
          if (
            target[0]['innerText'] !== 'WhatsApp' &&
            target[0]['innerText'] !== window['statusInicial']
          ) {
            window['statusInicial'] = target[0]['innerText'];
            return window['statusInicial'];
          }
        }
      })
      .catch(() => undefined);
    if (infoLog) {
      callback(infoLog);
    }
    await sleep(200);
  }
}

export async function puppeteerMutationListener(oldValue, newValue) {
  console.log(`${oldValue} -> ${newValue}`);
}

export function folderSession(
  options: CreateConfig,
  session: string,
  returnFolder: boolean = true
) {
  const folderSession = path.join(
    path.resolve(
      process.cwd(),
      options.mkdirFolderToken,
      options.folderNameToken,
      session
    )
  );

  if (!fs.existsSync(folderSession)) {
    fs.mkdirSync(folderSession, {
      recursive: true
    });
  }

  const folderMulidevice = path.join(
    path.resolve(
      process.cwd(),
      options.mkdirFolderToken,
      options.folderNameToken
    )
  );

  if (!fs.existsSync(folderMulidevice)) {
    fs.mkdirSync(folderMulidevice, {
      recursive: true
    });
  }

  fs.chmodSync(folderMulidevice, '777');
  fs.chmodSync(folderSession, '777');

  options.puppeteerOptions = {
    userDataDir: folderSession,
    ignoreHTTPSErrors: true
  } as LaunchOptions;

  puppeteerConfig.chromiumArgs.push(`--user-data-dir=${folderSession}`);

  if (returnFolder) {
    return folderSession;
  }
}
/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
export async function initBrowser(
  spinnies: any,
  session: string,
  options: CreateConfig,
  extras = {}
): Promise<Browser | string> {
  const chromePath = getChrome();
  if (chromePath && options.useChrome) {
    extras = { ...extras, executablePath: chromePath };
  } else {
    if (options.BrowserFetcher) {
      const browserFetcher = puppeteer.createBrowserFetcher(undefined);

      spinnies.add(`extract-file`, {
        text: `Await download Chromium`
      });
      let init = true;
      await browserFetcher
        .download(options.chromiumVersion, (downloadedByte, totalBytes) => {
          if (init) {
            spinnies.add(`chromium-${session}`, {
              text: 'Check chromium....'
            });

            spinnies.add(`chromium-total-${session}`, {
              text: 'Checking the total bytes to download!'
            });
            init = false;
          }

          if (downloadedByte) {
            spinnies.update(`chromium-${session}`, {
              text: `Total byte value....${downloadedByte}`
            });
          }

          if (totalBytes) {
            spinnies.update(`chromium-total-${session}`, {
              text: `Total Bytes ${totalBytes}`
            });
          }

          if (downloadedByte === totalBytes) {
            spinnies.succeed(`chromium-${session}`, {
              text: `Chromium Finished result`
            });
            spinnies.succeed(`chromium-total-${session}`, {
              text: `Chromium completed result`
            });
            spinnies.update(`extract-file`, {
              text: `Extract files... await...`
            });
          }
        })
        .then((revisionInfo) => {
          spinnies.succeed(`extract-file`, {
            text: `Extract files concluded`
          });
          extras = {
            ...extras,
            executablePath: revisionInfo.executablePath
          };
          puppeteerConfig.chromiumArgs.push(`--single-process`);
        })
        .catch((e) => {
          console.log('error chromium: ', e);
          extras = {};
        });
    } else {
      console.log('Chrome not found, using chromium');
      extras = {};
    }
  }

  folderSession(options, session);

  // Use stealth plugin to avoid being detected as a bot
  puppeteer.use(StealthPlugin());

  if (Array.isArray(options.addProxy) && options.addProxy.length) {
    const proxy =
      options.addProxy[Math.floor(Math.random() * options.addProxy.length)];
    options.browserArgs
      ? Object.assign(options.browserArgs, [`--proxy-server=${proxy}`])
      : Object.assign(puppeteerConfig.chromiumArgs, [
          `--proxy-server=${proxy}`
        ]);

    // console.log(puppeteerConfig.chromiumArgs);
  }
  if (
    Array.isArray(options?.addBrowserArgs) &&
    options?.addBrowserArgs.length > 0
  ) {
    for (
      let index: number = 0;
      index < options?.addBrowserArgs.length;
      index++
    ) {
      const element = options?.addBrowserArgs[index];
      if (!puppeteerConfig.chromiumArgs.includes(element)) {
        puppeteerConfig.chromiumArgs.push(element);
      }
    }
  }
  let browser = null;
  if (options.browserWS && options.browserWS != '') {
    await puppeteer
      .connect({
        browserWSEndpoint: options.browserWS
      })
      .then((e) => {
        browser = e;
      })
      .catch(() => {
        browser = 'connect';
      });
  } else {
    await puppeteer
      .launch({
        headless: options.headless,
        devtools: options.devtools,
        args:
          Array.isArray(options.browserArgs) && options.browserArgs.length
            ? options.browserArgs
            : [...puppeteerConfig.chromiumArgs],
        ...options.puppeteerOptions,
        ...extras
      })
      .then((e) => {
        browser = e;
      })
      .catch((e) => {
        console.error('Error launch: ', e);
        browser = 'launch';
      });
  }
  try {
    const arg = browser
      .process()
      .spawnargs.find((s: string) => s.startsWith('--user-data-dir='));

    if (arg) {
      const tmpUserDataDir = arg.split('=')[1];

      // Only if path is in TMP directory
      if (path.relative(os.tmpdir(), tmpUserDataDir).startsWith('puppeteer')) {
        process.on('exit', () => {
          // Remove only on exit signal
          try {
            rimraf.sync(tmpUserDataDir);
          } catch (error) {}
        });
      }
    }
  } catch (error) {}
  return browser;
}

export async function getWhatsappPage(
  browser: Browser | BrowserContext
): Promise<Page> {
  const pages = await browser.pages().catch();
  if (pages.length) {
    return pages[0];
  }
  return await browser.newPage().catch();
}

/**
 * Retrieves chrome instance path
 */
function getChrome() {
  try {
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
    return chromeInstalations[0];
  } catch (error) {
    return undefined;
  }
}
