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
import { statusManagement } from '../../controllers/status-management'
import { interfaceStatusManagement } from '../../controllers/interface-management'

export class HostLayer {
  readonly session: string
  readonly options: CreateConfig
  protected autoCloseInterval = null

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
      statusManagement.setStatus('autocloseCalled', this.session)
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

    // FIXME - Possible leak
    while (true) {
      if (statusManagement.isCreationCancelled(this.session)) {
        throw new Error('Creation Stopped')
      }

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

        catchQR(result.base64Image, asciiQRCode, attempt, result.urlCode)
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
    ) => void
  ) {
    logger.debug(`[waitForLogin:${this.session}] Waiting for login...`)

    let authenticated = await isAuthenticated(this.page).catch(() => null)

    if (typeof authenticated === 'object' && authenticated.type) {
      // TODO - There's this only here if error http status 429. Can be refactored
      logger.error(
        `[waitForLogin:${this.session}] fail to authenticate: ${authenticated.type}`
      )

      try {
        if (!this.page.isClosed()) {
          await this.page.close()
        }
        if (this.browser.connected) {
          await this.browser.close()
        }
        statusManagement.removeSession(this.session)
        interfaceStatusManagement.removeSession()
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
      statusManagement.setStatus('notLogged', this.session)

      // FIXME catch
      await this.waitForQrCodeScan(catchQR).catch((error) => {
        if (error.message === 'Creation Stopped') {
          throw error
        }
        logger.error(error)
      })

      logger.info(`[waitForLogin:${this.session}] Checking QRCode status...`)

      // Wait for interface update
      await sleep(200)

      // FIXME catch
      authenticated = await isAuthenticated(this.page).catch(() => null)

      if (authenticated === null || JSON.stringify(authenticated) === '{}') {
        logger.error(`[waitForLogin:${this.session}] Failed to authenticate!`)
        statusManagement.setStatus('qrReadFail', this.session)
      } else if (authenticated) {
        logger.info(`[waitForLogin:${this.session}] Authenticated!`)
        statusManagement.setStatus('qrReadSuccess', this.session)
      } else {
        logger.info(`[waitForLogin:${this.session}] Failed to read QRCode`)
        statusManagement.setStatus('qrReadFail', this.session)

        this.cancelAutoClose()
        this.tryAutoClose()

        throw 'Failed to read the QRCode'
      }
    } else if (authenticated === true) {
      logger.info(`[waitForLogin:${this.session}] Authenticated!`)
      statusManagement.setStatus('isLogged', this.session)
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
        statusManagement.setStatus('phoneNotConnected', this.session)

        // FIXME - missing await
        this.cancelAutoClose()
        this.tryAutoClose()
        throw new Error('Phone not connected')
      }

      this.cancelAutoClose()

      logger.info(`[waitForLogin:${this.session}] Connected!`)
      // TODO check if call is necessary
      //   statusManagement.setStatus('inChat', this.session);
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
