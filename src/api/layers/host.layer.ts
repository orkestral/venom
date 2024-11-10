import { Page, Browser } from 'puppeteer';
import { CreateConfig, defaultOptions } from '../../config/create-config';
import { SocketState } from '../model/enum';
//import { injectApi } from '../../controllers/browser';
import { ScrapQrcode } from '../model/qrcode';
import { scrapeImg } from '../helpers';
import {
  asciiQr,
  isAuthenticated,
  isInsideChats,
  needsToScan,
  retrieveQR
} from '../../controllers/auth';
import { sleep } from '../../utils/sleep';

export class HostLayer {
  readonly session: string;
  readonly options: CreateConfig;

  protected spinStatus = {
    apiInject: '',
    autoCloseRemain: 0,
    previousText: '',
    previousStatus: null,
    state: ''
  };

  protected autoCloseInterval = null;
  protected statusFind?: (statusGet: string, session: string) => void = null;

  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    this.session = session;
    this.options = { ...defaultOptions, ...options };
  }

  protected tryAutoClose() {
    if (
      this.options.autoClose > 0 &&
      !this.autoCloseInterval &&
      !this.page.isClosed()
    ) {
      this.statusFind && this.statusFind('autocloseCalled', this.session);
      this.page.close().catch(() => {});
      this.browser.close().catch(() => {});
    }
  }

  protected startAutoClose() {
    if (this.options.autoClose > 0 && !this.autoCloseInterval) {
      let remain = this.options.autoClose;
      try {
        this.autoCloseInterval = setInterval(() => {
          if (this.page.isClosed()) {
            this.cancelAutoClose();
            return;
          }
          remain -= 1000;
          this.spinStatus.autoCloseRemain = Math.round(remain / 1000);
          if (remain <= 0) {
            this.cancelAutoClose();
            this.tryAutoClose();
          }
        }, 1000);
      } catch (e) {}
    }
  }

  public cancelAutoClose() {
    clearInterval(this.autoCloseInterval);
    this.autoCloseInterval = null;
  }

  public async getQrCode() {
    let qrResult: ScrapQrcode | undefined | any;

    qrResult = await scrapeImg(this.page).catch((e) => console.log(e));
    if (!qrResult || !qrResult.urlCode) {
      qrResult = await retrieveQR(this.page).catch((e) => console.log(e));
    }
    return qrResult;
  }

  public async waitForQrCodeScan(
    catchQR?: (
      qrCode: string,
      asciiQR: string,
      attempt: number,
      urlCode?: string
    ) => void
  ) {
    let urlCode = null;
    let attempt = 0;

    while (true) {
      let needsScan = await needsToScan(this.page).catch(() => null);
      if (!needsScan) {
        break;
      }
      const result = await this.getQrCode().catch(() => null);

      if (!result.urlCode) {
        break;
      }

      if (urlCode !== result.urlCode) {
        urlCode = result.urlCode;
        attempt++;

        let qr = '';

        if (this.options.logQR || catchQR) {
          qr = await asciiQr(urlCode).catch(() => undefined);
        }

        if (this.options.logQR) {
          console.log(qr);
        } else {
          console.info(`Waiting for QRCode Scan: Attempt ${attempt}`);
        }

        if (catchQR) {
          catchQR(result.base64Image, qr, attempt, result.urlCode);
        }
      }
      await sleep(200).catch(() => undefined);
    }
  }

  public async waitForInChat() {
    let inChat = await isInsideChats(this.page);

    while (inChat === false) {
      await sleep(200);
      inChat = await isInsideChats(this.page);
    }
    return inChat;
  }

  public async waitForLogin(
    catchQR?: (
      qrCode: string,
      asciiQR: string,
      attempt: number,
      urlCode?: string
    ) => void,
    statusFind?: (statusGet: string, session?: string) => void
  ) {
    this.statusFind = statusFind;

    console.info('Waiting page load');
    let authenticated = await isAuthenticated(this.page).catch(() => null);

    if (typeof authenticated === 'object' && authenticated.type) {
      console.error(`Error http: ${authenticated.type}`);
      this.page.close().catch(() => {});
      this.browser.close().catch(() => {});
      throw `Error http: ${authenticated.type}`;
    }

    this.startAutoClose();

    if (authenticated === false) {
      console.info('Waiting for QRCode Scan...');
      statusFind && statusFind('notLogged', this.session);

      await this.waitForQrCodeScan(catchQR).catch(() => undefined);

      console.info('Checking QRCode status...');

      // Wait for interface update
      await sleep(200);
      authenticated = await isAuthenticated(this.page).catch(() => null);

      if (authenticated === null || JSON.stringify(authenticated) === '{}') {
        console.error('Failed to authenticate');
        statusFind && statusFind('qrReadFail', this.session);
      } else if (authenticated) {
        console.info('QRCode Success');
        statusFind && statusFind('qrReadSuccess', this.session);
      } else {
        console.error('QRCode Fail', 'fail');
        statusFind && statusFind('qrReadFail', this.session);
        this.cancelAutoClose();
        this.tryAutoClose();
        throw 'Failed to read the QRCode';
      }
    } else if (authenticated === true) {
      console.info('Authenticated');
      statusFind && statusFind('isLogged', this.session);
    }

    if (authenticated === true) {
      // Reinicia o contador do autoclose
      this.cancelAutoClose();
      this.startAutoClose();
      // Wait for interface update
      await sleep(200);
      console.info('Checking phone is connected...');
      const inChat = await this.waitForInChat();

      if (!inChat) {
        console.error('Phone not connected');
        statusFind && statusFind('phoneNotConnected', this.session);
        this.cancelAutoClose();
        this.tryAutoClose();
        throw new Error('Phone not connected');
      }
      this.cancelAutoClose();
      console.info('Connected');
      //   statusFind && statusFind('inChat', this.session);
      return true;
    }

    if (authenticated === false) {
      this.cancelAutoClose();
      this.tryAutoClose();
      console.error('Not logged');
      throw new Error('Not logged');
    }

    this.cancelAutoClose();
    this.tryAutoClose();
    console.error('Unknown error');
  }

  //Pro
  /**
   * Set offline
   */
  public async setPresenceOffline() {
    return await this.page.evaluate(() => WAPI.setPresenceOffline());
  }

  //Pro
  /**
   * Set online
   */
  public async setPresenceOnline() {
    return await this.page.evaluate(() => WAPI.setPresenceOnline());
  }

  /**
   * Delete the Service Workers
   */
  public async killServiceWorker() {
    return await this.page.evaluate(() => WAPI.killServiceWorker());
  }

  /**
   * Load the service again
   */
  public async restartService() {
    return await this.page.evaluate(() => WAPI.restartService());
  }

  /**
   * @returns Current host device details
   */
  public async getHostDevice(): Promise<Object> {
    return await this.page.evaluate(() => WAPI.getHost());
  }

  /**
   * Retrieves WA version
   */
  public async getWAVersion() {
    return await this.page.evaluate(() => WAPI.getWAVersion());
  }

  /**
   * Retrieves the connecction state
   */
  public async getConnectionState(): Promise<SocketState> {
    return await this.page.evaluate(() => {
      //@ts-ignore
      return Store.State.Socket.state;
    });
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   */
  public async isConnected() {
    return await this.page.evaluate(() => WAPI.isConnected());
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   */
  public async isLoggedIn() {
    return await this.page.evaluate(() => WAPI.isLoggedIn());
  }

  /**
   * Retrieves information about the host including who is logged in
   */
  public async getHost() {
    return await this.page.evaluate(() => WAPI.getHost());
  }

  /**
   * Retrieves Battery Level
   */
  public async getBatteryLevel() {
    return await this.page.evaluate(() => WAPI.getBatteryLevel());
  }
}
