import * as ChromeLauncher from 'chrome-launcher';
import chromeVersion from 'chrome-version';
import * as fs from 'fs';
import * as path from 'path';
import {
  Browser,
  BrowserContext,
  Page,
  LaunchOptions,
  Puppeteer
} from 'puppeteer';
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
import * as unzipper from 'unzipper';

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

async function getLatestChromeVersion() {
  try {
    const response = await axios.get(
      'https://omahaproxy.appspot.com/all.json?os=win&channel=stable'
    );

    const chromeData = response.data.find((item: any) => item.os === 'win');
    const latestVersion = chromeData.versions[0];
    return latestVersion;
  } catch (error) {
    console.error('Error getting latest Chrome version');
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
    // Use stealth plugin to avoid being detected as a bot
    puppeteer.use(StealthPlugin());

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
    const executablePath =
      getChrome() ?? puppeteer.executablePath() ?? chromePath;

    console.log('Path Google-Chrome: ', executablePath);

    if (executablePath || isChromeInstalled(executablePath)) {
      console.error('Could not find the google-chrome browser on the machine!');

      // Download the latest version of Chrome
      const latestVersion = await getLatestChromeVersion();

      if (latestVersion) {
        console.log(latestVersion);
        const downloadUrl = `https://github.com/Hibbiki/chromium-win64/releases/download/v${latestVersion.version}-r${latestVersion.branch_base_position}/chrome.sync.7z`;
        console.log('Downloading Chrome Url:', downloadUrl);
        console.log('Downloading Chrome Version:', latestVersion.version);
        const zipFilePath = path.join(process.cwd(), 'chrome.sync.7z');
        const extractPath = path.join(process.cwd(), 'chrome');

        console.log('Path download Chrome:', zipFilePath);

        const response = await axios.get(downloadUrl, {
          responseType: 'arraybuffer'
        });

        // Verifica se o status da resposta é 200 (OK)
        if (response.status === 200) {
          await fs.promises.writeFile(zipFilePath, response.data);

          console.log('Download completed.');

          console.log('Extracting Chrome...', extractPath);

          fs.createReadStream(zipFilePath).pipe(
            unzipper.Extract({ path: extractPath })
          );

          // const zip = await unzipper.Open.file(zipFilePath);
          // await zip.extract({ path: extractPath });

          console.log('Chrome extracted successfully.');
          console.log(path.join(extractPath, 'chrome-win', 'chrome.exe'));
        } else {
          console.error('Falha no download do arquivo.');
          return false;
        }
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
      return getWindowsChromeExecutablePath();
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'linux':
      return '/usr/bin/google-chrome';
    default:
      console.error('Could not find browser.');
      return null;
  }
}

function getWindowsChromeExecutablePath() {
  const programFilesPath = process.env.ProgramFiles || '';
  const programFilesx86Path = process.env['ProgramFiles(x86)'] || '';

  if (programFilesx86Path) {
    return path.join(
      programFilesx86Path,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    );
  } else if (programFilesPath) {
    return path.join(
      programFilesPath,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    );
  } else {
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

/**
 * Retrieves chrome instance path
 */
function getChrome() {
  try {
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
    return chromeInstalations[0];
  } catch (error) {
    console.error('Error checking Chrome installation:', error);
    return undefined;
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
