import { LaunchOptions } from 'puppeteer';
import { puppeteerConfig } from './puppeteer.config';

// Server config
export interface options {
  /**
   * logs info updates automatically in terminal
   * @default true
   */
  updatesLog?: boolean;
  /**
   * name of the token to be generated, a folder with all customer information will be created
   * @default 'session'
   */
  session?: string;
  /** folder name when saving tokens
   * @default 'tokens'
   */
  folderNameToken?: string;
  /**
   * folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
   * @default 'null'
   */
  mkdirFolderToken?: string;
  /**
   * Headless chrome
   * @default "old"
   */
  headless?: boolean | 'new' | 'old';
  /**
   * If you want to use browserWSEndpoint
   */
  browserWS?: string;
  /**
   * Parameters to be added into the chrome browser instance
   */
  browserArgs?: string[];
  /**
   * Add broserArgs without overwriting the project's original
   */
  addBrowserArgs?: string[];
  /**
   * Will be passed to puppeteer.launch
   */
  puppeteerOptions?: LaunchOptions;
  /**
   * Logs QR automatically in terminal
   * @default true
   */
  logQR?: boolean;
  /**
   * Will disable the welcoming message which appears in the beginning
   * @default false
   */
  disableWelcome?: boolean;
  /**
   * Automatically closes the venom-bot only when scanning the QR code (default 60000 miliseconds, if you want to turn it off, assign 0 or false)
   * @default 60000
   */
  autoClose?: number;
  /**
   * Creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
   * @default true
   */
  createPathFileToken?: boolean;
  /**
   * automatically download Chromium browser
   * @default true
   */
  BrowserFetcher?: boolean;
  /**
   * Add proxy server
   * @default null
   */
  addProxy?: string[];
  /**
   * Proxy username
   * @default null
   */
  userProxy?: string;
  /**
   * Proxy password
   * @default null
   */
  userPass?: string;
  /**
   * Open devtools by default
   * @default false
   */
  devtools?: boolean;
  /**
   * Browser executable path
   * @default null
   */
  browserPathExecutable?: string;
}

export const defaultOptions: options = {
  session: 'name-session',
  folderNameToken: 'tokens',
  disableWelcome: false,
  BrowserFetcher: true,
  updatesLog: true,
  headless: 'old',
  logQR: true,
  devtools: false,
  mkdirFolderToken: '',
  browserWS: '',
  browserArgs: puppeteerConfig.chromiumArgs,
  addBrowserArgs: [],
  autoClose: 120000,
  addProxy: [],
  browserPathExecutable: ''
};
