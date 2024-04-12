import { Page, Browser } from 'puppeteer'
import { ControlsLayer } from './layers/controls.layer'
import { Message } from './model'
import { magix, timeout, makeOptions } from './helpers/decrypt'
import { useragentOverride } from '../config/WAuserAgente'
import { CreateConfig } from '../config/create-config'
import axios from 'axios'
import * as path from 'path'
import fs from 'fs/promises'

export class Whatsapp extends ControlsLayer {
  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options)

    this.page.on('load', async () => {
      // FIXME - This process is a problem. Every time wpp reload (and it do a lot), this is inject.
      // Therefore, if we close, cancel, send message and is reloading, it will not work and get error. Mostly protocol error.
      try {
        await this.initService()
        await page
          .waitForSelector('#app .two', { visible: true })
          .catch(() => {})
        await this.addChatWapi()
      } catch (error) {
        console.error('failed loading page', error)
      }
    })
  }

  async initService() {
    try {
      // Allow backwards compatibility without specifying any specific options
      // The assumption is that WA switched away from Webpack at/after 2.3
      // This can be removed when all browsers have rolled over to new non-webpack version
      let useWebpack = false
      if (
        this.options.forceWebpack === false &&
        this.options.webVersion === false
      ) {
        // NOTE return whatsapp version
        const actualWebVersion = await this.page.evaluate(() => {
          return window['Debug'] && window['Debug'].VERSION
            ? window['Debug'].VERSION
            : ''
        })

        const versionNumber = parseFloat(actualWebVersion)
        useWebpack = versionNumber < 2.3
      }

      if (this.options.forceWebpack === false && !useWebpack) {
        await this.page.evaluate(() => {
          window['__debug'] = eval("require('__debug');")
        })
      } else {
        await this.page
          .waitForFunction('webpackChunkwhatsapp_web_client.length')
          .catch()
      }

      const js = await fs.readFile(
        require.resolve(path.join(__dirname, '../lib/wapi/', 'wapi.js')),
        'utf-8'
      )
      await this.page.evaluate(js)

      const middleware_script = await fs.readFile(
        require.resolve(
          path.join(__dirname, '../lib/middleware', 'middleware.js')
        ),
        'utf-8'
      )
      await this.page.evaluate(middleware_script)

      await this.initialize()
    } catch (error) {
      console.log(error)
    }
  }

  async addChatWapi() {
    await this.page.evaluate(() => WAPI.addChatWapi())
  }

  /**
   * Decrypts message file
   * @param data Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async downloadFile(data: string) {
    return await this.page.evaluate((data) => WAPI.downloadFile(data), data)
  }

  /**
   * Download and returns the media content in base64 format
   * @param messageId Message ou id
   * @returns Base64 of media
   */
  public async downloadMedia(messageId: string | Message): Promise<string> {
    if (typeof messageId !== 'string') {
      messageId = messageId.id
    }

    const result = await this.page
      .evaluate(
        (messageId) =>
          WAPI.downloadMedia(messageId).catch((e) => ({
            __error: e,
          })),
        messageId
      )
      .catch(() => undefined)

    if (typeof result === 'object' && result.__error) {
      throw result.__error
    }
    return result as string
  }

  /**
   * Get the puppeteer page instance
   * @returns The Whatsapp page
   */
  get waPage(): Page {
    return this.page
  }

  /**
   * Clicks on 'use here' button (When it get unlaunched)
   * This method tracks the class of the button
   * Whatsapp web might change this class name over the time
   * Dont rely on this method
   */
  public async useHere() {
    return await this.page.evaluate(() => WAPI.takeOver())
  }

  /**
   * Logout whastapp
   * @returns boolean
   */
  public async logout() {
    return await this.page.evaluate(() => WAPI.logout())
  }

  /**
   * Closes page and browser
   * @internal
   */
  public async close() {
    try {
      if (!this.page.isClosed()) {
        await this.page.close()
      }
      if (this.browser.connected) {
        await this.browser.close()
      }
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Get message by id
   * @param messageId string
   * @returns Message object
   */
  public async getMessageById(messageId: string) {
    return (await this.page.evaluate(
      (messageId: any) => WAPI.getMessageById(messageId),
      messageId
    )) as Message
  }

  /**
   * Decrypts message file
   * @param message Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async decryptFile(message: Message) {
    const options = makeOptions(useragentOverride)
    message.clientUrl =
      message.clientUrl !== undefined
        ? message.clientUrl
        : message.deprecatedMms3Url

    if (!message.clientUrl) {
      throw new Error(
        'message is missing critical data needed to download the file.'
      )
    }

    let haventGottenImageYet: boolean = true,
      res: any
    try {
      while (haventGottenImageYet) {
        res = await axios.get(message.clientUrl.trim(), options)
        if (res.status == 200) {
          haventGottenImageYet = false
        } else {
          await timeout(2000)
        }
      }
    } catch (error) {
      console.error(error)
      throw 'Error trying to download the file.'
    }
    const buff = Buffer.from(res.data, 'binary')
    return magix(buff, message.mediaKey, message.type, message.size)
  }
}
