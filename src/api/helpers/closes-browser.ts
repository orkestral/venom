import { Browser } from 'puppeteer'

export async function checkingCloses(
  browser: Browser | string,
  statusFind: (e: string) => void
) {
  new Promise(async (resolve, reject) => {
    if (typeof browser !== 'string') {
      let err: boolean
      do {
        try {
          await new Promise((r) => setTimeout(r, 2000))
          if (browser['isClose'] || !browser.connected) {
            if (browser['isClose']) {
              browser.close().catch((e) => reject(e))
              statusFind('browserClose')
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
