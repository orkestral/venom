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
): Promise<Page | false> {
  const waPage = await getWhatsappPage(browser);
  if (!waPage) {
    return false;
  }
  try {
    await waPage.setUserAgent(useragentOverride);

    const hasUserPass =
      typeof options.userPass === 'string' && options.userPass.length;
    const hasUserProxy =
      typeof options.userProxy === 'string' && options.userProxy.length;
    const hasAddProxy =
      Array.isArray(options.addProxy) && options.addProxy.length;

    if (hasUserPass && hasUserProxy && hasAddProxy) {
      await waPage.authenticate({
        username: options.userProxy,
        password: options.userPass
      });
    }

    await waPage.goto(puppeteerConfig.whatsappUrl, {
      waitUntil: 'domcontentloaded'
    });

    waPage.on('pageerror', ({ message }) => {
      const erroLogType1 = message.includes('RegisterEffect is not a function');
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
  } catch (error) {
    console.error(error);
    await waPage.close();
    return false;
  }
}

export async function getWhatsappPage(
  browser: Browser | BrowserContext
): Promise<Page | false> {
  try {
    const pages: Page[] = await browser.pages();
    if (pages.length !== 0) {
      return pages[0];
    } else {
      return await browser.newPage();
    }
  } catch {
    return false;
  }
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

export async function initBrowser(
  session: string,
  options: CreateConfig
): Promise<Browser | false> {
  try {
    folderSession(options, session);

    // Set the executable path to the path of the Chrome binary or the executable path provided
    const executablePath = getChrome() ?? puppeteer.executablePath();
    const extras = { executablePath };

    // Use stealth plugin to avoid being detected as a bot
    puppeteer.use(StealthPlugin());

    if (Array.isArray(options.addProxy) && options.addProxy.length) {
      const proxy =
        options.addProxy[Math.floor(Math.random() * options.addProxy.length)];
      const args = options.browserArgs ?? puppeteerConfig.chromiumArgs;
      args.push(`--proxy-server=${proxy}`);
    }

    if (
      Array.isArray(options.addBrowserArgs) &&
      options.addBrowserArgs.length
    ) {
      options.addBrowserArgs.forEach((arg) => {
        if (!puppeteerConfig.chromiumArgs.includes(arg)) {
          puppeteerConfig.chromiumArgs.push(arg);
        }
      });
    }

    const launchOptions = {
      headless: options.headless,
      devtools: options.devtools,
      args: options.browserArgs ?? puppeteerConfig.chromiumArgs,
      ...options.puppeteerOptions,
      ...extras
    };

    if (options.browserWS && options.browserWS !== '') {
      return await puppeteer.connect({ browserWSEndpoint: options.browserWS });
    } else {
      return await puppeteer.launch(launchOptions);
    }
  } catch {
    return false;
  }
}

function getChrome() {
  try {
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
    return chromeInstalations[0];
  } catch (error) {
    return undefined;
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
