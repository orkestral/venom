import * as ChromeLauncher from 'chrome-launcher';
import * as path from 'path';
import { Browser, BrowserContext, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin = require('puppeteer-extra-plugin-stealth');
import { auth_InjectToken } from './auth';
import { useragentOverride } from '../config/WAuserAgente';
import { tokenSession } from '../config/tokenSession.config';

export async function initWhatsapp(
  session: string,
  options: CreateConfig,
  browser: Browser,
  token?: tokenSession
): Promise<false | Page> {
  const waPage: Page = await getWhatsappPage(browser);
  if (waPage != null) {
    try {
      await waPage.setUserAgent(useragentOverride);
      await waPage.goto(puppeteerConfig.whatsappUrl, {
        waitUntil: 'domcontentloaded',
      });
      //console.log(await browser.userAgent());
      // Auth with token
      await auth_InjectToken(waPage, session, options, token);
      await waPage.evaluate(() => {
        window.location.reload();
      });
      return waPage;
    } catch {
      waPage.close().catch(() => {});
      browser.close().catch(() => {});
      return false;
    }
  }
}

export async function injectApi(page: Page) {
  const injected = await page
    .evaluate(() => {
      // @ts-ignore
      return (
        typeof window.WAPI !== 'undefined' &&
        typeof window.Store !== 'undefined'
      );
    })
    .catch(() => false);

  if (injected) {
    return;
  }

  await page.addScriptTag({
    path: require.resolve(path.join(__dirname, '../lib/wapi', 'wapi.js')),
  });

  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../lib/middleware', 'middleware.js')
    ),
  });

  // Make sure WAPI is initialized
  await page.waitForFunction(() => {
    // @ts-ignore
    return (
      typeof window.WAPI !== 'undefined' && typeof window.Store !== 'undefined'
    );
  });

  return page;
}

/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
export async function initBrowser(
  session: string,
  options: CreateConfig,
  extras = {}
): Promise<Browser | string> {
  if (options.useChrome) {
    const chromePath = getChrome();
    if (chromePath) {
      extras = { ...extras, executablePath: chromePath };
    } else {
      console.log('Chrome not found, using chromium');
      extras = {};
    }
  }

  // Use stealth plugin to avoid being detected as a bot
  puppeteer.use(StealthPlugin());

  let browser = null;
  if (options.browserWS && options.browserWS != '') {
    await puppeteer
      .connect({
        browserWSEndpoint: options.browserWS,
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
        args: options.browserArgs
          ? options.browserArgs
          : [...puppeteerConfig.chromiumArgs],
        ...options.puppeteerOptions,
        ...extras,
      })
      .then((e) => {
        browser = e;
      })
      .catch(() => {
        browser = 'launch';
      });
  }
  return browser;
}

export async function getWhatsappPage(
  browser: Browser | BrowserContext
): Promise<Page> {
  const pages = await browser.pages();

  if (pages.length) {
    return pages[0];
  }

  return await browser.newPage();
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
