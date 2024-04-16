import { Browser } from 'puppeteer'
import { CreateConfig } from '../../config/create-config'
import { statusManagement } from '../../controllers/status-management'

// FIXME - Missing session
export async function checkingCloses(
  browser: Browser | string,
  mergedOptions: CreateConfig
) {
  new Promise(async (resolve, reject) => {
    // NOTE - Is this really necessary?
    if (typeof browser !== 'string') {
      let err: boolean
      do {
        try {
          await new Promise((r) => setTimeout(r, 2000))
          if (
            browser['isClose'] ||
            (mergedOptions.browserWS && !browser.connected)
          ) {
            if (mergedOptions.browserWS) {
              browser.disconnect()
              statusManagement.setStatus('serverClose')
            }
            if (browser['isClose']) {
              browser.close().catch((e) => reject(e))
              statusManagement.setStatus('browserClose')
            }
            err = false
          } else {
            throw 1
          }
        } catch (e) {
          err = true
        }
      } while (err)
    }
  })
}
