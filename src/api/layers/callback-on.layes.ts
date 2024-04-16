import { onMode } from '../model/enum'
import { sleep } from '../helpers'

/**
 * attribution and behavior change of a given event
 */
// NOTE - Is this really necessary?
export class CallbackOnStatus {
  public callbackStatus: any
  constructor() {
    this.callbackStatus = ''
  }

  /**
   * waiting for event change
   * @param event returns event status
   */
  async onChange(event: (status: any) => void) {
    let change = null
    while (true) {
      if (this.callbackStatus !== change) {
        change = this.callbackStatus
        event && event(change)
      }
      await sleep(50)
    }
  }

  /**
   * here you can monitor user events
   * @param type types of monitoring
   * @param callback returns of monitoring
   */
  public async on(type: onMode, callback: (state: any) => void) {
    switch (type) {
      case onMode.interfaceChange:
        this.onChange((event) => {
          if (event.onType === onMode.interfaceChange) {
            callback(event)
          }
        })
        break
      case onMode.newOnAck:
        this.onChange((event) => {
          if (event.onType === onMode.newOnAck) {
            callback(event)
          }
        })
        break
      case onMode.newMessage:
        this.onChange((event) => {
          if (event.onType === onMode.newMessage) {
            callback(event)
          }
        })
        break
      case onMode.qrcode:
        this.onChange((event) => {
          if (event.onType === onMode.qrcode) {
            callback(event)
          }
        })
        break
      case onMode.connection:
        this.onChange((event) => {
          if (event.onType === onMode.connection) {
            callback(event)
          }
        })
        break
    }
  }
}
