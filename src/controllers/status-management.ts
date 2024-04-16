import { logger } from '../utils/logger'
import { CallbackStatus } from './initializer'

/**
 * Status possible
 */
type Status =
  | 'autocloseCalled'
  | 'browserClose'
  | 'connectBrowserWs'
  | 'deviceNotConnected'
  | 'disconnected'
  | 'disconnectedMobile'
  | 'erroPageWhatsapp'
  | 'inChat'
  | 'initBrowser'
  | 'initInstance'
  | 'initWhatsapp'
  | 'isLogged'
  | 'noOpenBrowser'
  | 'notLogged'
  | 'openBrowser'
  | 'phoneNotConnected'
  | 'qrReadFail'
  | 'qrReadSuccess'
  | 'serverClose'
  | 'successChat'
  | 'successPageWhatsapp'
  | 'waitChat'
  | 'waitForLogin'

type StatusSession = {
  [key: string]: {
    status: Status
    created: boolean
    cancelCreation: boolean
    originalCallbackStatus: CallbackStatus
  }
}

class StatusManagement {
  private statusSession: StatusSession

  constructor() {
    this.statusSession = {}
  }

  initCallbackStatus = (session?: string, callbackStatus?: CallbackStatus) => {
    session = this.sessionNameDefaulTo(session)
    if (this.statusSession[session]) {
      return logger.warn(`[callbackStatus-${session}] Status already started`)
    }

    if (typeof callbackStatus !== 'function') {
      callbackStatus = () => {}
    }

    this.statusSession[session] = {
      status: 'initInstance',
      created: false,
      cancelCreation: false,
      originalCallbackStatus: callbackStatus,
    }

    this.statusSession[session].originalCallbackStatus('initInstance', session)
  }

  getStatus = (session?: string) => {
    session = this.sessionNameDefaulTo(session)
    if (!this.statusSession[session]) {
      return logger.warn(`[callbackStatus-${session}] Session not found`)
    }
    return this.statusSession[session].status
  }

  setStatus = (callbackStatus: Status, session?: string) => {
    session = this.sessionNameDefaulTo(session)
    this.statusSession[session].status = callbackStatus
    this.statusSession[session].originalCallbackStatus(callbackStatus, session)
  }

  isCreationCancelled = (session?: string): boolean => {
    session = this.sessionNameDefaulTo(session)
    if (!this.statusSession[session]) {
      logger.error(`[callbackStatus-${session}] Session not found`)
      throw new Error(`Session ${session} not found`)
    }
    return this.statusSession[session].cancelCreation
  }

  cancelCreation = (session?: string) => {
    session = this.sessionNameDefaulTo(session)
    if (!this.statusSession[session]) {
      return logger.warn(
        `[global-${session}] No instance started for ${session}`
      )
    }
    if (this.statusSession[session].cancelCreation) {
      return logger.warn(
        `[callbackStatus-${session}] Creation already cancelled`
      )
    }
    if (this.statusSession[session].created) {
      return logger.warn(`[callbackStatus-${session}] Creation already created`)
    }
    this.statusSession[session].cancelCreation = true
  }

  setStatusCompleted = (session?: string) => {
    session = this.sessionNameDefaulTo(session)
    if (!this.statusSession[session]) {
      return logger.warn(
        `[global-${session}] No session started for ${session}`
      )
    }
    this.statusSession[session].created = true
    this.setStatus('successChat', session)
  }

  removeSession = (session?: string) => {
    session = this.sessionNameDefaulTo(session)
    if (!this.statusSession[session]) {
      return logger.warn(
        `[global-${session}] No session started for ${session}`
      )
    }
    delete this.statusSession[session]
  }

  private sessionNameDefaulTo = (session?: string) => {
    if (typeof session !== 'string' || !session.replace(/\s/g, '').length) {
      session = 'session'
    }
    return session
  }
}

const statusManagement = new StatusManagement()

export { Status, statusManagement }
