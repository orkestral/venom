import * as ChromeLauncher from 'chrome-launcher';
import * as fs from 'fs';
import * as path from 'path';
import { Browser, BrowserContext, Page, LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { useragentOverride } from '../config/WAuserAgente';
import { sleep } from '../utils/sleep';
import * as Spinnies from 'spinnies';

export async function initWhatsapp(
  options: CreateConfig,
  browser: Browser
): Promise<false | Page> {
  const waPage: Page | boolean = await getWhatsappPage(browser);
  if (waPage) {
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
        const erroLogType1 = message.includes(
          'RegisterEffect is not a function'
        );
        const erroLogType2 = message.includes('[Report Only]');
        if (erroLogType1 || erroLogType2) {
          waPage.evaluate(() => {
            localStorage.clear();
            window.location.reload();
          });
        }
      });

      await browser.userAgent();
      return waPage;
    } catch {
      waPage.close();
      return false;
    }
  }
  return false;
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

export function folderSession(options: CreateConfig, session: string) {
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
}

/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
export async function initBrowser(
  spinnies: any,
  session: string,
  options: CreateConfig
): Promise<Browser | boolean> {
  folderSession(options, session);
  let extras = {};
  const chromePath = getChrome() ?? puppeteer.executablePath();

  extras = { ...extras, executablePath: chromePath };

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

  if (options.browserWS && options.browserWS != '') {
    try {
      return await puppeteer.connect({
        browserWSEndpoint: options.browserWS
      });
    } catch {
      return false;
    }
  } else {
    try {
      return await puppeteer.launch({
        headless: options.headless,
        devtools: options.devtools,
        args:
          Array.isArray(options.browserArgs) && options.browserArgs.length
            ? options.browserArgs
            : [...puppeteerConfig.chromiumArgs],
        ...options.puppeteerOptions,
        ...extras
      });
    } catch {
      return false;
    }
  }
}

export async function getWhatsappPage(
  browser: Browser | BrowserContext
): Promise<Page | false> {
  try {
    const page: Page[] = await browser.pages();
    if (page.length) return page[0];
    return await browser.newPage();
  } catch {
    return false;
  }
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
