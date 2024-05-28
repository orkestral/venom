import { logger } from '../utils/logger'
import { options } from '../config'
import { CreateConfig } from '../config/create-config'

import * as fs from 'fs'
import { HTTPRequest, Page } from 'puppeteer'

class WhatsappCacheManagement {
  private baseWppCacheURL =
    'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html'
  private waPage: Page | undefined
  private waVersionHTML: string = ''
  private webVersion: string = ''
  private forceWebpack: boolean = false

  setup(waPage: Page, options: options | CreateConfig) {
    this.waPage = waPage
    if (
      typeof options.waVersionHTML === 'string' &&
      options.waVersionHTML.length
    ) {
      this.waVersionHTML = options.waVersionHTML
    }
    if (typeof options.webVersion === 'string' && options.webVersion.length) {
      this.webVersion = options.webVersion
    }
  }

  async initListener() {
    if (this.waVersionHTML || this.webVersion) {
      await this.waPage.setRequestInterception(true)
      this.waPage.on('request', async (req) => {
        if (req.url() === 'https://web.whatsapp.com/') {
          await this.useWppPageCache(req)
        } else {
          await this.filterCookies(req)
        }
      })
    }
  }

  async useWppPageCache(req: HTTPRequest) {
    if (this.waVersionHTML && fs.existsSync(this.waVersionHTML)) {
      this.injectCacheFromHtml(req)
      logger.info(
        `[WhatsappCacheManagement.getWppCached] cache injected from html successfully`
      )
      return
    } else if (this.webVersion) {
      this.injectCacheFromRepository(req)
      logger.info(
        `[WhatsappCacheManagement.getWppCached] cache injected from repository successfully`
      )
      return
    }
    logger.error(
      `[WhatsappCacheManagement.getWppCached] No cached whatsapp version found`
    )
  }

  async injectCacheFromHtml(req: HTTPRequest) {
    try {
      const file = fs.readFileSync(this.waVersionHTML, 'utf8')
      req.respond({
        status: 200,
        contentType: 'text/html',
        body: file,
      })
      return
    } catch (err) {
      logger.error(
        `[WhatsappCacheManagement.injectCacheFromHtml] Error trying to readFile. error=${err}`
      )
      return
    }
  }

  async injectCacheFromRepository(req: HTTPRequest) {
    const url = `${this.baseWppCacheURL}/${this.webVersion}.html`

    await req.respond({
      status: 200,
      contentType: 'text/html',
      body: await (await fetch(url)).text(),
    })
    return
  }

  async filterCookies(req: HTTPRequest) {
    if (this.forceWebpack === true) {
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
}

const whatsappCacheManagement = new WhatsappCacheManagement()

export { whatsappCacheManagement }
