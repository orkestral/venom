import { Page, Browser } from 'puppeteer'
import { CreateConfig, defaultOptions } from '../../config/create-config'
import { SocketState } from '../model/enum'
//import { injectApi } from '../../controllers/browser';
import { ScrapQrcode } from '../model/qrcode'
import { scrapeImg } from '../helpers'
import {
  asciiQr,
  isAuthenticated,
  isInsideChats,
  needsToScan,
  retrieveQR,
} from '../../controllers/auth'
import { sleep } from '../../utils/sleep'
import { logger } from '../../utils/logger'

export class HostLayer {
  readonly session: string
  readonly options: CreateConfig
  protected autoCloseInterval = null
  protected statusFind?: (statusGet: string, session: string) => void = null

  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    this.session = session
    this.options = { ...defaultOptions, ...options }
    //this._initialize(this.page);
  }

  // public async _initialize(page: Page) {
  //   this.spinStatus.apiInject = 'injecting';
  //   await injectApi(page)
  //     .then(() => {
  //       this.spinStatus.apiInject = 'injected';
  //     })
  //     .catch(() => {
  //       this.spinStatus.apiInject = 'failed';
  //     });
  // }

  protected tryAutoClose() {
    if (
      this.options.autoClose > 0 &&
      !this.autoCloseInterval &&
      !this.page.isClosed()
    ) {
      this.statusFind && this.statusFind('autocloseCalled', this.session)
      // FIXME - missing await and try catch
      this.page.close().catch(() => {})
      this.browser.close().catch(() => {})
    }
  }

  protected startAutoClose() {
    if (this.options.autoClose > 0 && !this.autoCloseInterval) {
      let remain = this.options.autoClose
      try {
        this.autoCloseInterval = setInterval(() => {
          if (this.page.isClosed()) {
            this.cancelAutoClose()
            return
          }
          remain -= 1000

          if (remain <= 0) {
            this.cancelAutoClose()
            this.tryAutoClose()
          }
        }, 1000)
      } catch (e) {}
    }
  }

  public cancelAutoClose() {
    clearInterval(this.autoCloseInterval)
    this.autoCloseInterval = null
  }

  public async getQrCode() {
    try {
      let qrResult: ScrapQrcode | undefined | any

      qrResult = await scrapeImg(this.page).catch((e) => console.log(e))
      if (!qrResult || !qrResult.urlCode) {
        qrResult = await retrieveQR(this.page).catch((e) => console.log(e))
      }
      return qrResult
    } catch (error) {
      logger.error(`[getQrCode] Failed to get QR code ${JSON.stringify(error)}`)
      return
    }
  }

  public async waitForQrCodeScan(
    catchQR?: (
      qrCode: string,
      asciiQR: string,
      attempt: number,
      urlCode?: string
    ) => void
  ) {
    let urlCode = null
    let attempt = 0

    // FIXME - verificar possível memory leak
    while (true) {
      const needsScan = await needsToScan(this.page)

      if (!needsScan) {
        break
      }

      const result = await this.getQrCode()

      if (!result?.urlCode) {
        break
      }

      if (urlCode !== result.urlCode) {
        urlCode = result.urlCode
        attempt++

        let asciiQRCode = ''

        if (this.options.logQR || catchQR) {
          asciiQRCode = await asciiQr(urlCode)
        }

        if (this.options.logQR) {
          logger.info(asciiQRCode)
        } else {
          logger.info(`Waiting for QRCode Scan: Attempt ${attempt}`)
        }

        if (catchQR) {
          catchQR(result.base64Image, asciiQRCode, attempt, result.urlCode)
        }
      }

      await sleep(200)
    }
  }

  public async waitForInChat() {
    let inChat = await isInsideChats(this.page)

    while (inChat === false) {
      await sleep(200)
      inChat = await isInsideChats(this.page)
    }
    return inChat
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
    this.statusFind = statusFind

    logger.debug(`[waitForLogin:${this.session}] Waiting for login...`)

    let authenticated = await isAuthenticated(this.page).catch(() => null)

    if (typeof authenticated === 'object' && authenticated.type) {
      logger.error(
        `[waitForLogin:${this.session}] fail to authenticate: ${authenticated.type}`
      )

      try {
        await this.page.close()
        await this.browser.close()
      } catch (error) {
        logger.warn(
          `[waitForLogin] Error closing page and browser=${JSON.stringify(
            error
          )}`
        )
      }

      throw new Error(`Error http: ${authenticated.type}`)
    }

    this.startAutoClose()

    if (authenticated === false) {
      logger.info(`[waitForLogin:${this.session}] Waiting for QRCode Scan...`)

      statusFind && statusFind('notLogged', this.session)

      // FIXME catch
      await this.waitForQrCodeScan(catchQR).catch(() => undefined)

      logger.info(`[waitForLogin:${this.session}] Checking QRCode status...`)

      // Wait for interface update
      await sleep(200)

      // FIXME catch
      authenticated = await isAuthenticated(this.page).catch(() => null)

      if (authenticated === null || JSON.stringify(authenticated) === '{}') {
        logger.error(`[waitForLogin:${this.session}] Failed to authenticate!`)
        statusFind && statusFind('qrReadFail', this.session)
      } else if (authenticated) {
        logger.info(`[waitForLogin:${this.session}] Authenticated!`)
        statusFind && statusFind('qrReadSuccess', this.session)
      } else {
        logger.info(`[waitForLogin:${this.session}] Failed to read QRCode`)
        statusFind && statusFind('qrReadFail', this.session)

        this.cancelAutoClose()
        this.tryAutoClose()

        throw 'Failed to read the QRCode'
      }
    } else if (authenticated === true) {
      logger.info(`[waitForLogin:${this.session}] Authenticated!`)
      statusFind && statusFind('isLogged', this.session)
    }

    if (authenticated === true) {
      // Reinicia o contador do autoclose
      // FIXME - missing await
      this.cancelAutoClose()
      this.startAutoClose()

      // Wait for interface update
      await sleep(200)

      logger.debug(
        `[waitForLogin:${this.session}] Checking phone is connected...`
      )
      const inChat = await this.waitForInChat()

      if (!inChat) {
        logger.error(`[waitForLogin:${this.session}] Phone not connected`)
        statusFind && statusFind('phoneNotConnected', this.session)

        // FIXME - missing await
        this.cancelAutoClose()
        this.tryAutoClose()
        throw new Error('Phone not connected')
      }

      this.cancelAutoClose()

      logger.info(`[waitForLogin:${this.session}] Connected!`)
      // TODO check if call is necessary
      //   statusFind && statusFind('inChat', this.session);
      return true
    }

    if (authenticated === false) {
      this.cancelAutoClose()
      this.tryAutoClose()

      logger.error(`[waitForLogin:${this.session}] Not logged.`)
      throw new Error('Not logged')
    }

    this.cancelAutoClose()
    this.tryAutoClose()

    logger.error(`[waitForLogin:${this.session}] Unknow error.`)
  }

  //Pro
  /**
   * Set offline
   */
  public async setPresenceOffline() {
    return await this.page.evaluate(() => WAPI.setPresenceOffline())
  }

  //Pro
  /**
   * Set online
   */
  public async setPresenceOnline() {
    return await this.page.evaluate(() => WAPI.setPresenceOnline())
  }

  /**
   * Delete the Service Workers
   */
  public async killServiceWorker() {
    return await this.page.evaluate(() => WAPI.killServiceWorker())
  }

  /**
   * Load the service again
   */
  public async restartService() {
    return await this.page.evaluate(() => WAPI.restartService())
  }

  /**
   * @returns Current host device details
   */
  public async getHostDevice(): Promise<Object> {
    return await this.page.evaluate(() => WAPI.getHost())
  }

  /**
   * Retrieves WA version
   */
  public async getWAVersion() {
    return await this.page.evaluate(() => WAPI.getWAVersion())
  }

  /**
   * Retrieves the connecction state
   */
  public async getConnectionState(): Promise<SocketState> {
    return await this.page.evaluate(() => {
      //@ts-ignore
      return Store.State.Socket.state
    })
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   */
  public async isConnected() {
    return await this.page.evaluate(() => WAPI.isConnected())
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   */
  public async isLoggedIn() {
    return await this.page.evaluate(() => WAPI.isLoggedIn())
  }

  /**
   * Retrieves Battery Level
   */
  public async getBatteryLevel() {
    return await this.page.evaluate(() => WAPI.getBatteryLevel())
  }
}
