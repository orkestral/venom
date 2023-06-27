import * as ChromeLauncher from 'chrome-launcher';
import chromeVersion from 'chrome-version';
import * as fs from 'fs';
import * as path from 'path';
import { Browser, BrowserContext, Page, LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { options } from '../config';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { useragentOverride } from '../config/WAuserAgente';
import { sleep } from '../utils/sleep';
import * as Spinnies from 'spinnies';
import * as os from 'os';
import axios from 'axios';
import unzipper from 'unzipper';

export async function initWhatsapp(
  options: options | CreateConfig,
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

export function folderSession(options: options | CreateConfig) {
  try {
    if (!options || !options.folderNameToken || !options.session) {
      throw new Error(`Missing required options`);
    }

    const folderSession = options.mkdirFolderToken
      ? path.join(
          path.resolve(
            process.cwd(),
            options.mkdirFolderToken,
            options.folderNameToken,
            options.session
          )
        )
      : path.join(
          path.resolve(process.cwd(), options.folderNameToken, options.session)
        );

    if (!fs.existsSync(folderSession)) {
      fs.mkdirSync(folderSession, { recursive: true });
    }

    const folderMulidevice = options.mkdirFolderToken
      ? path.join(
          path.resolve(
            process.cwd(),
            options.mkdirFolderToken,
            options.folderNameToken
          )
        )
      : path.join(path.resolve(process.cwd(), options.folderNameToken));

    if (!fs.existsSync(folderMulidevice)) {
      fs.mkdirSync(folderMulidevice, { recursive: true });
    }

    fs.chmodSync(folderMulidevice, '777');
    fs.chmodSync(folderSession, '777');

    options.puppeteerOptions = {
      userDataDir: folderSession,
      ignoreHTTPSErrors: true
    } as LaunchOptions;

    puppeteerConfig.chromiumArgs.push(`--user-data-dir=${folderSession}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function isChromeInstalled(executablePath: string): boolean {
  try {
    fs.accessSync(executablePath);
    return true;
  } catch {
    return false;
  }
}

async function getLatestChromeVersion() {
  try {
    const response = await axios.get(
      'https://api.github.com/repos/chromium/chromium/releases/latest'
    );
    const latestVersion = response.data.tag_name;
    return latestVersion;
  } catch (error) {
    console.error('Error getting latest Chrome version:', error);
    return null;
  }
}

async function getGlobalChromeVersion(): Promise<string | null> {
  try {
    const chromePath = ChromeLauncher.Launcher.getInstallations().pop();
    if (chromePath) {
      const version = await chromeVersion(chromePath);
      return version;
    }
  } catch (e) {
    console.error('Error retrieving Chrome version:', e);
  }
  return null;
}

export async function initBrowser(
  options: options | CreateConfig
): Promise<Browser | false> {
  try {
    const checkFolder = folderSession(options);
    if (!checkFolder) {
      console.error('Error executing client session info');
      return false;
    }
    if (options.headless !== 'new' && options.headless !== false) {
      console.error('Now use only headless: "new" or false');
      return false;
    }

    const chromePath = getChromeExecutablePath();
    // Set the executable path to the path of the Chrome binary or the executable path provided
    const executablePath = chromePath || puppeteer.executablePath();

    console.log('Path Google-Chrome: ', executablePath);

    if (!executablePath || !isChromeInstalled(executablePath)) {
      console.error('Could not find the google-chrome browser on the machine!');

      // Download the latest version of Chrome
      const latestVersion = await getLatestChromeVersion();
      if (latestVersion) {
        const downloadUrl = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F${latestVersion}%2Fchrome-win.zip?generation=1630501359489848&alt=media`;
        const zipFilePath = path.join(os.tmpdir(), 'chrome-win.zip');
        const extractPath = path.join(os.tmpdir(), 'chrome-win');

        console.log('Downloading Chrome:', downloadUrl);

        const response = await axios.get(downloadUrl, {
          responseType: 'stream'
        });
        const writeStream = fs.createWriteStream(zipFilePath);
        response.data.pipe(writeStream);

        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        console.log('Download completed.');

        console.log('Extracting Chrome...');

        await fs
          .createReadStream(zipFilePath)
          .pipe(unzipper.Extract({ path: extractPath }))
          .promise();

        console.log('Chrome extracted successfully.');

        // Update the executable path
        options.puppeteerOptions.executablePath = path.join(
          extractPath,
          'chrome-win',
          'chrome.exe'
        );
      } else {
        console.error('Failed to retrieve the latest Chrome version.');
        return false;
      }
    }

    let chromeVersion = '';
    if (executablePath.includes('google-chrome')) {
      chromeVersion = await getGlobalChromeVersion();
    } else {
      const browser = await puppeteer.launch({ executablePath });
      chromeVersion = await browser.version();
      await browser.close();
    }

    console.log('Chrome Version:', chromeVersion);

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
  } catch (e) {
    console.error(e);
    return false;
  }
}

function getChromeExecutablePath() {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return path.join(
        process.env.LOCALAPPDATA,
        'Google',
        'Chrome',
        'Application',
        'chrome.exe'
      );
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'linux':
      return '/usr/bin/google-chrome';
    default:
      console.error('Could not find browser.');
      return null;
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
