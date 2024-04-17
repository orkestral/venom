import * as ChromeLauncher from 'chrome-launcher'
import chromeVersion from 'chrome-version'
import * as fs from 'fs'
import * as path from 'path'
import {
  Browser,
  BrowserContext,
  Page,
  LaunchOptions,
  PuppeteerLaunchOptions,
} from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import { options } from '../config'
import { CreateConfig } from '../config/create-config'
import { puppeteerConfig } from '../config/puppeteer.config'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { useragentOverride } from '../config/WAuserAgente'
import * as os from 'os'
import { defaultOptions } from '../config/create-config'
import { exec } from 'child_process'
import { logger } from '../utils/logger'

type CustomLaunchOptions = LaunchOptions & {
  headless?: boolean | 'new' | 'old'
  mkdirFolderToken?: options['mkdirFolderToken']
  folderNameToken?: options['folderNameToken']
  session?: options['session']
  puppeteerOptions?: options['puppeteerOptions']
  addBrowserArgs?: options['addBrowserArgs']
  browserPathExecutable?: options['browserPathExecutable']
  devtools?: options['devtools']
  browserArgs?: options['browserArgs']
  addProxy?: options['addProxy']
  browserWS?: options['browserWS']
}

const cach_url =
  'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/'

function isRoot() {
  return process.getuid && process.getuid() === 0
}

export async function initWhatsapp(
  options: options | CreateConfig,
  browser: Browser
): Promise<Page | false> {
  const waPage = await getWhatsappPage(browser)
  if (!waPage) {
    return false
  }
  try {
    await waPage.setUserAgent(useragentOverride)
    await waPage.setBypassCSP(true)
    waPage.setDefaultTimeout(60000)

    const { userPass, userProxy, addProxy } = options

    // TODO criar proprio cache de versão e fazer download dele
    if (typeof options.webVersion === 'string' && options.webVersion.length) {
      await waPage.setRequestInterception(true)
      waPage.on('request', async (req) => {
        if (req.url() === 'https://web.whatsapp.com/') {
          const url = cach_url + options.webVersion + '.html'

          await req.respond({
            status: 200,
            contentType: 'text/html',
            body: await (await fetch(url)).text(),
          })
        } else {
          if (options.forceWebpack === true) {
            const headers = req.headers()
            if (headers.cookie) {
              // Filter out the 'wa_build' cookies and reconstruct the cookie header
              headers.cookie = headers.cookie
                .split(';')
                .filter((cookie) => !cookie.trim().startsWith('wa_build'))
                .join(';')
            }

            // Continue the request with potentially modified headers
            await req.continue({ headers })
          } else {
            await req.continue()
          }
        }
      })
    }
    if (
      typeof userPass === 'string' &&
      userPass.length &&
      typeof userProxy === 'string' &&
      userProxy.length &&
      Array.isArray(addProxy) &&
      addProxy.length
    ) {
      await waPage.authenticate({
        username: userProxy,
        password: userPass,
      })
    }

    await waPage.goto(puppeteerConfig.whatsappUrl, {
      waitUntil: 'domcontentloaded',
    })

    waPage.on('pageerror', (error) => {
      const erroLogType1 = error?.message?.includes(
        'RegisterEffect is not a function'
      )
      const erroLogType2 = error?.message?.includes('[Report Only]')
      if (erroLogType1 || erroLogType2) {
        waPage.evaluate(() => {
          localStorage.clear()
          window.location.reload()
        })
      }
      // NOTE - Why do nothing if not these errors?
    })
    // NOTE - Is this necessary?
    await browser.userAgent()
    return waPage
  } catch (error) {
    console.error(error)
    await waPage.close()
    return false
  }
}

export async function getWhatsappPage(
  browser: Browser | BrowserContext
): Promise<Page | false> {
  try {
    const pages: Page[] = await browser.pages()
    return pages.length !== 0 ? pages[0] : await browser.newPage()
  } catch {
    return false
  }
}

export function folderSession(
  options: options | CreateConfig | CustomLaunchOptions
) {
  try {
    if (!options) {
      throw new Error(`Missing required options`)
    }
    if (!options.folderNameToken) {
      options.folderNameToken = defaultOptions.folderNameToken
    }

    if (!options.session) {
      options.session = defaultOptions.session
    }

    const folderMultiDevice = options.mkdirFolderToken
      ? path.join(
          path.resolve(
            process.cwd(),
            options.mkdirFolderToken,
            options.folderNameToken
          )
        )
      : path.join(path.resolve(process.cwd(), options.folderNameToken))

    if (!fs.existsSync(folderMultiDevice)) {
      fs.mkdirSync(folderMultiDevice, { recursive: true })
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
        )

    if (!fs.existsSync(folderSession)) {
      fs.mkdirSync(folderSession, { recursive: true })
    }

    fs.chmodSync(folderMultiDevice, '777')
    fs.chmodSync(folderSession, '777')

    options.puppeteerOptions = {
      userDataDir: folderSession,
      ignoreHTTPSErrors: true,
    } as LaunchOptions

    puppeteerConfig.chromiumArgs.push(`--user-data-dir=${folderSession}`)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function getGlobalChromeVersion(): Promise<string | null> {
  try {
    const chromePath = ChromeLauncher.Launcher.getInstallations().pop()
    if (chromePath) {
      const version = await chromeVersion(chromePath)
      return version
    }
  } catch (e) {
    console.error('Error retrieving Chrome version:', e)
  }
  return null
}

async function getChromeVersionBash(executablePath: string): Promise<string> {
  const notCheckText = 'Not check version'

  try {
    const platform = os.platform()
    let command = ''

    if (platform === 'linux') {
      command = `${executablePath} --version`
    } else if (platform === 'darwin' && executablePath.includes('Chrome')) {
      command =
        '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version'
    }

    if (!command) {
      return notCheckText
    }

    const { stdout, stderr } = await execAsync(command)
    if (stderr) {
      return notCheckText
    }

    const version = stdout.trim().split(' ').pop()
    return version
  } catch (error) {
    return notCheckText
  }
}

function execAsync(
  command: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ stdout, stderr })
    })
  })
}

export async function initBrowser(
  executablePath: string,
  options: CustomLaunchOptions
): Promise<Browser> {
  puppeteer.use(StealthPlugin())

  const checkFolder = folderSession(options)
  if (!checkFolder) {
    throw new Error(`Error executing client session info`)
  }

  // Check for deprecated headless option
  if (options.headless === true) {
    console.warn(
      'Warning: The usage of "headless: true" is deprecated. Please use "headless": "new" or "headless": "false" instead. https://developer.chrome.com/articles/new-headless/'
    )
  }
  if (
    options.headless !== 'new' &&
    options.headless !== 'old' &&
    options.headless !== false &&
    options.headless !== true
  ) {
    throw new Error('Now use only headless: "new", "true" or false')
  }

  const platform = os.platform()

  if (!executablePath || !isChromeInstalled(executablePath)) {
    logger.error(
      `[browser-${options.session}] Could not find the browser on the machine!`
    )
    throw new Error('Could not find the browser on the machine!')
  }

  let chromeVersion = ''
  let versionTimeout: string | number | NodeJS.Timeout

  logger.debug(`[browser-${options.session}] Platform: ${platform}`)

  if (platform === 'darwin' || platform === 'linux') {
    chromeVersion = await getChromeVersionBash(executablePath)
  } else {
    if (executablePath.includes('google-chrome')) {
      chromeVersion = await getGlobalChromeVersion()
    } else {
      const browser = await puppeteer.launch({
        executablePath,
        headless:
          options.headless === true || options.headless === false
            ? options.headless
            : 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      versionTimeout = setTimeout(() => {
        browser.close()
        throw new Error('This browser version has problems')
      }, 10000)
      chromeVersion = await browser.version()
      clearTimeout(versionTimeout)
      await browser.close()
    }
  }

  if (chromeVersion) {
    logger.info(
      `[browser-${options.session}] Browser Version: ${chromeVersion}`
    )
  }

  const extras = { executablePath }

  if (Array.isArray(options.addProxy) && options.addProxy.length) {
    const proxy =
      options.addProxy[Math.floor(Math.random() * options.addProxy.length)]
    const args = options.browserArgs ?? puppeteerConfig.chromiumArgs
    args.push(`--proxy-server=${proxy}`)
  }

  if (Array.isArray(options.addBrowserArgs) && options.addBrowserArgs.length) {
    options.addBrowserArgs.forEach((arg) => {
      if (!puppeteerConfig.chromiumArgs.includes(arg)) {
        puppeteerConfig.chromiumArgs.push(arg)
      }
    })
  }

  if (options.headless === 'old') {
    puppeteerConfig.chromiumArgs.push(`--headless=old`)
  }

  const launchOptions = {
    headless: options.headless as 'new' | boolean,
    devtools: options.devtools,
    args: options.browserArgs ?? puppeteerConfig.chromiumArgs,
    ...options.puppeteerOptions,
    ...extras,
  }

  const isRunningAsRoot = isRoot()
  if (isRunningAsRoot && options.browserArgs && options.browserArgs.length) {
    addArgsRoot(options.browserArgs)
  }

  await removeStoredSingletonLock(options.puppeteerOptions, options)

  if (options.browserWS && options.browserWS !== '') {
    return await puppeteer.connect({ browserWSEndpoint: options.browserWS })
  } else {
    await removeStoredSingletonLock(options.puppeteerOptions, options)
    return await puppeteer.launch(launchOptions)
  }
}

function addArgsRoot(args: string[]) {
  if (Array.isArray(args)) {
    args.forEach((option) => {
      if (!puppeteerConfig.argsRoot.includes(option)) {
        puppeteerConfig.argsRoot.push(option)
      }
    })
  }
}

function isChromeInstalled(executablePath: string): boolean {
  try {
    fs.accessSync(executablePath)
    return true
  } catch {
    return false
  }
}

function removeStoredSingletonLock(
  puppeteerOptions: PuppeteerLaunchOptions,
  options: options | CreateConfig
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const platform = os.platform()
      const { userDataDir } = puppeteerOptions
      const singletonLockPath = path.join(
        path.resolve(process.cwd(), userDataDir, 'SingletonLock')
      )

      if (platform === 'win32') {
        // No need to remove the lock on Windows, so resolve with true directly.
        resolve(true)
        return
      }

      logger.debug(
        `[remove-stored-singleton-lock${options.session}] Path Stored "SingletonLock": ${singletonLockPath}`
      )

      if (fs.existsSync(singletonLockPath)) {
        logger.debug(
          `[remove-stored-singleton-lock${options.session}] The file was found "SingletonLock`
        )

        fs.unlink(singletonLockPath, (error) => {
          if (error && error.code !== 'ENOENT') {
            logger.error(
              `[remove-stored-singleton-lock${options.session}] Error removing "SingletonLock": ${error}`
            )
            reject(false)
            return
          } else {
            logger.debug(
              `[remove-stored-singleton-lock${options.session}] re-adding the file "SingletonLock": ${singletonLockPath}`
            )

            fs.writeFile(singletonLockPath, '', (error) => {
              if (error && error.code !== 'ENOENT') {
                logger.error(
                  `[remove-stored-singleton-lock${options.session}] could not add the file "SingletonLock": ${singletonLockPath}`
                )
                reject(false)
                return
              } else {
                logger.debug(
                  `[remove-stored-singleton-lock${options.session}] file created successfully "SingletonLock": ${singletonLockPath}`
                )
                resolve(true)
              }
            })
          }
        })

        return
      }

      logger.debug(
        `[remove-stored-singleton-lock${options.session}] The file "SingletonLock" was not found`
      )
      resolve(true)
    } catch (error) {
      logger.debug(
        `[remove-stored-singleton-lock${
          options.session
        }] failed to check the file "SingletonLock": ${JSON.stringify(error)}`
      )
      resolve(true)
    }
  })
}
