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
import axios from 'axios'
import { defaultOptions } from '../config/create-config'
import * as unzipper from 'unzipper'
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
    })

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

    // TODO - Entender diferença entre session token e multi aí
    const folderMulidevice = options.mkdirFolderToken
      ? path.join(
          path.resolve(
            process.cwd(),
            options.mkdirFolderToken,
            options.folderNameToken
          )
        )
      : path.join(path.resolve(process.cwd(), options.folderNameToken))

    if (!fs.existsSync(folderMulidevice)) {
      fs.mkdirSync(folderMulidevice, { recursive: true })
    }

    fs.chmodSync(folderMulidevice, '777')
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

async function checkPathDowload(extractPath: string) {
  try {
    const pathChrome = path.join(extractPath, 'chrome-win', 'chrome.exe')
    if (!fs.existsSync(pathChrome)) {
      return false
    }
    return pathChrome
  } catch {
    return false
  }
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

function downloadBash(): Promise<string | false> {
  return new Promise((resolve, reject) => {
    try {
      const platform = os.platform()
      if (platform === 'linux') {
        exec(
          'curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (error, stdout, stderr) => {
            if (error) {
              throw new Error(
                `Error downloading Google Chrome: ${error.message}`
              )
            }
            exec(
              'sudo dpkg -i google-chrome-stable_current_amd64.deb',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (error, stdout, stderr) => {
                if (error) {
                  throw new Error(
                    `Error installing Google Chrome: ${error.message}`
                  )
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                exec('sudo apt-get update', (error, stdout, stderr) => {
                  if (error) {
                    throw new Error(
                      `Error update dependencies: ${error.message}`
                    )
                  }

                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  exec('sudo apt-get install -f', (error, stdout, stderr) => {
                    if (error) {
                      throw new Error(
                        `Error fixing dependencies: ${error.message}`
                      )
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    exec('which google-chrome', (error, stdout, stderr) => {
                      if (error) {
                        throw new Error(
                          `Error getting Google Chrome path: ${error.message}`
                        )
                      }
                      const path = stdout.trim()
                      console.log(
                        `Google Chrome installed successfully at: ${path}`
                      )
                      return resolve(path)
                    })
                  })
                })
              }
            )
          }
        )
      } else if (platform === 'darwin') {
        exec(
          'curl -O https://dl.google.com/chrome/mac/stable/GGRO/googlechrome.dmg',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (error, stdout, stderr) => {
            if (error) {
              throw new Error(
                `Error downloading Google Chrome: ${error.message}`
              )
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            exec('hdiutil attach googlechrome.dmg', (error, stdout, stderr) => {
              if (error) {
                throw new Error(`Error mounting DMG file: ${error.message}`)
              }

              exec(
                'rsync -a "/Volumes/Google Chrome/Google Chrome.app" "/Applications/"',
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (error, stdout, stderr) => {
                  if (error) {
                    throw new Error(
                      `Error installing Google Chrome: ${error.message}`
                    )
                  }

                  exec(
                    'hdiutil detach "/Volumes/Google Chrome"',
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (error, stdout, stderr) => {
                      if (error) {
                        throw new Error(
                          `Error unmounting DMG file: ${error.message}`
                        )
                      }

                      exec(
                        'ls -d "/Applications/Google Chrome.app"',
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        (error, stdout, stderr) => {
                          if (error) {
                            console.error(
                              `Error getting Google Chrome path: ${error.message}`
                            )
                            return
                          }

                          const path = stdout.trim()
                          console.log(
                            `Google Chrome installed successfully at: ${path}`
                          )
                          return resolve(path)
                        }
                      )
                    }
                  )
                }
              )
            })
          }
        )
      }
    } catch (error) {
      console.error(error)
      return reject(false)
    }
  })
}

export async function initBrowser(
  options: CustomLaunchOptions
): Promise<Browser | false> {
  try {
    // Use stealth plugin to avoid being detected as a bot
    puppeteer.use(StealthPlugin())

    const checkFolder = folderSession(options)
    if (!checkFolder) {
      throw new Error(`Error executing client session info`)
    }

    // Check for deprecated headless option
    if (options.headless === true) {
      console.warn(
        'Warning: The usage of "headless: true" is deprecated. Please use "headless: \'new\'" or "headless: false" instead. https://developer.chrome.com/articles/new-headless/'
      )
    }

    if (
      options.headless !== 'new' &&
      options.headless !== 'old' &&
      options.headless !== false &&
      options.headless !== true
    ) {
      // TODO - Verificar sobre headless
      throw new Error('Now use only headless: "new", "true" or false')
    }

    const chromePath = getChromeExecutablePath()
    // Set the executable path to the path of the Chrome binary or the executable path provided
    let executablePath =
      options.browserPathExecutable ??
      getChrome() ??
      puppeteer.executablePath() ??
      chromePath

    const extractPath = path.join(process.cwd(), 'chrome')
    const checkPath = await checkPathDowload(extractPath)
    const platform = os.platform()

    if (!executablePath || !isChromeInstalled(executablePath)) {
      logger.warn(
        `[browser-${options.session}] Could not find the google-chrome browser on the machine!`
      )
      const resultBash = await downloadBash()
      if (resultBash) {
        executablePath = resultBash
      } else if (!checkPath) {
        logger.debug(`[browser-${options.session}] Downloading browser...`)

        // Download the latest version of Chrome
        const downloadUrl = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F1000027%2Fchrome-win.zip?generation=1651780728332948&alt=media`
        const zipFilePath = path.join(process.cwd(), 'chrome', 'chrome-win.zip')

        if (!fs.existsSync(extractPath)) {
          fs.mkdirSync(extractPath, { recursive: true })
        }

        fs.chmodSync(extractPath, '777')

        logger.debug(
          `[browser-${options.session}] Path download Chrome: ${zipFilePath}`
        )

        const response = await axios.get(downloadUrl, {
          responseType: 'arraybuffer',
        })

        // Verifica se o status da resposta é 200 (OK)
        if (response.status === 200) {
          await fs.promises.writeFile(zipFilePath, response.data)
          logger.debug(
            `[browser-${options.session}] Extracting Chrome: ${extractPath}`
          )

          const zip = await unzipper.Open.file(zipFilePath)
          await zip.extract({ path: extractPath })

          logger.debug(
            `[browser-${options.session}] Chrome extracted successfully.`
          )
          const pathChrome = path.join(extractPath, 'chrome-win', 'chrome.exe')
          if (!fs.existsSync(pathChrome)) {
            throw new Error(`Error no Path download Chrome`)
          }
          const checkDowl = await checkPathDowload(extractPath)
          if (!checkDowl) {
            throw new Error(`Error no Path download Chrome`)
          }

          const folderChrom = path.join(extractPath, 'chrome-win')
          fs.chmodSync(folderChrom, '777')

          executablePath = pathChrome

          logger.info(
            `[browser-${options.session}] Using executable path: ${executablePath}`
          )
        } else {
          throw new Error('Error download file Chrome.')
        }
      } else {
        executablePath = checkPath
      }
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

    if (
      Array.isArray(options.addBrowserArgs) &&
      options.addBrowserArgs.length
    ) {
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

    if (options.browserWS && options.browserWS !== '') {
      return await puppeteer.connect({ browserWSEndpoint: options.browserWS })
    } else {
      await removeStoredSingletonLock(options.puppeteerOptions, options)
      return await puppeteer.launch(launchOptions)
    }
  } catch (error) {
    logger.error(
      `[browser-${options.session}] failed to init browser: ${JSON.stringify(
        error
      )}`
    )
    return false
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

function getChromeExecutablePath() {
  const platform = os.platform()
  switch (platform) {
    case 'win32':
      return getWindowsChromeExecutablePath()
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    case 'linux':
      return '/usr/bin/google-chrome'
    default:
      console.error('Could not find browser.')
      return null
  }
}

function getWindowsChromeExecutablePath() {
  const programFilesPath = process.env.ProgramFiles || ''
  const programFilesx86Path = process.env['ProgramFiles(x86)'] || ''

  if (programFilesx86Path) {
    return path.join(
      programFilesx86Path,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    )
  } else if (programFilesPath) {
    return path.join(
      programFilesPath,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    )
  } else {
    return null
  }
}

/**
 * Retrieves chrome instance path
 */
function getChrome() {
  try {
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations()
    return chromeInstalations[0]
  } catch (error) {
    return undefined
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
