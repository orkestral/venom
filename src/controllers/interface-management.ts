import { logger } from '../utils/logger'

/**
 * Status possible
 */
type InterfaceStatus =
  | 'initInterface'
  /**
   * The customer is in the chat
   */
  | 'chatsAvailable'
  /**
   * Client interface is loading page from syncing
   */
  | 'syncingOpening'
  /**
   * Client interface is loading syncing
   */
  | 'syncingLoading'
  /**
   * Syncing ready to be read!
   */
  | 'syncingNormal'
  /**
   * Client interface is loading page from qrcode
   */
  | 'qrcodeOpening'
  /**
   * Client interface is loading qrcode
   */
  | 'qrcodeLoading'
  /**
   * QR code ready to be read!
   */
  | 'qrcodeNormal'
  /**
   * Socket stream disconnected
   */
  | 'disconnected'

export type InterfaceChange = (
  callbackStatus: InterfaceStatus,
  session: string
) => void

class InterfaceStatusManagement {
  private session: string
  private status: InterfaceStatus
  private onInterfaceChangeCallback: InterfaceChange

  initCallbackStatus = (session: string, interfaceChange: InterfaceChange) => {
    if (this.session) {
      return logger.warn(
        `[InterfaceStatusManagement:${session}] Status already started`
      )
    }

    this.session = session
    this.status = 'initInterface'
    this.onInterfaceChangeCallback = interfaceChange

    this.onInterfaceChangeCallback(this.status, this.session)
  }

  getInterfaceStatus = () => {
    return this.status
  }

  setInterfaceStatus = (status: InterfaceStatus) => {
    this.status = status
    this.onInterfaceChangeCallback(this.status, this.session)
  }

  removeSession = () => {
    this.session = null
    this.status = null
    this.onInterfaceChangeCallback = null
  }
}

const interfaceStatusManagement = new InterfaceStatusManagement()

export { InterfaceStatus, interfaceStatusManagement }
