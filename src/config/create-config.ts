import { Browser, BrowserContext, LaunchOptions, Page } from 'puppeteer'
import { puppeteerConfig } from './puppeteer.config'

// Server config
export interface CreateConfig {
  session?: string
  /** folder name when saving tokens
   * @default 'tokens'
   */
  folderNameToken?: string
  /**
   * folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
   * @default 'null'
   */
  mkdirFolderToken?: string
  /**
   * Headless chrome
   * @default "old"
   */
  headless?: false | 'new' | 'old'
  /**
   * Open devtools by default
   * @default false
   */
  devtools?: boolean
  /**
   * Opens a debug session
   * @default false
   */
  debug?: boolean
  /**
   * If you want to use browserWSEndpoint
   */
  browserWS?: string
  /**
   * Parameters to be added into the chrome browser instance
   */
  browserArgs?: string[]
  /**
   * Add broserArgs without overwriting the project's original
   */
  addBrowserArgs?: string[]
  /**
   * Will be passed to puppeteer.launch
   */
  puppeteerOptions?: LaunchOptions
  /**
   * Pass a external browser instance, can be used with electron
   */
  browser?: Browser | BrowserContext
  /**
   * Pass a external page instance, can be used with electron
   */
  page?: Page
  /**
   * Logs QR automatically in terminal
   * @default true
   */
  logQR?: boolean
  /**
   * Will disable the welcoming message which appears in the beginning
   * @default false
   */
  disableWelcome?: boolean
  /**
   * Logs info updates automatically in terminal
   * @default true
   */
  updatesLog?: boolean
  /**
   * Automatically closes the whatsapp-bot only when scanning the QR code (default 60000 miliseconds, if you want to turn it off, assign 0 or false)
   * @default 60000
   */
  autoClose?: number
  /**
   * Creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
   * @default true
   */
  createPathFileToken?: boolean
  /**
   * Wait for in chat to return a instance of {@link Whatsapp}
   * @default true
   */
  waitForLogin?: boolean
  /**
   * automatically download Chromium browser
   * @default true
   */
  BrowserFetcher?: boolean
  /**
   * Forcing connection with whatsapp
   * @default true
   */
  forceConnect?: boolean
  /**
   * Wait attempts, to force connection
   * @default 5
   */
  attemptsForceConnectLoad?: number
  /**
   * force connect time stamp
   * @default 5000
   */
  forceConnectTime?: number
  /**
   * Add proxy server
   * @default null
   */
  addProxy?: string[]
  /**
   * Proxy username
   * @default null
   */
  userProxy?: string
  /**
   * Proxy password
   * @default null
   */
  userPass?: string
  /**
   * Force webpack version of WhatsApp.
   * @default false
   */
  forceWebpack?: boolean
  /**
   * Use a cached version of WhatsApp
   * @default false
   */
  webVersion?: boolean | string
}

export const defaultOptions: CreateConfig = {
  folderNameToken: 'tokens',
  mkdirFolderToken: '',
  headless: 'old',
  devtools: false,
  debug: false,
  logQR: true,
  browserWS: '',
  browserArgs: puppeteerConfig.chromiumArgs,
  addBrowserArgs: [],
  puppeteerOptions: {},
  disableWelcome: true,
  updatesLog: true,
  autoClose: 120000,
  createPathFileToken: true,
  waitForLogin: true,
  BrowserFetcher: true,
  forceConnect: false,
  attemptsForceConnectLoad: 5,
  forceConnectTime: 5000,
  addProxy: [],
  forceWebpack: false,
  webVersion: false,
}
