import { logger } from '../utils/logger'
import { Status, StatusFind } from './initializer'

export type StatusSession = {
  [key: string]: {
    status: Status
    created: boolean
    cancelCreation: boolean
  }
}

const statusSession: StatusSession = {}

export const defineStatusFind = (statusFind: StatusFind) => {
  if (typeof statusFind !== 'function') {
    statusFind = () => {}
  }
  const originalStatusFind = statusFind
  statusFind = (statusGet: Status, session: string) => {
    statusSession[session].status = statusGet
    originalStatusFind(statusGet, session)
  }

  return statusFind
}

export const getStatus = (session?: string) => {
  session = sessionNameDefaulTo(session)
  if (!statusSession[session]) {
    return logger.warn(`[statusFind-${session}] Session not found`)
  }
  return statusSession[session].status
}

export const isCreationCancelled = (session?: string): boolean => {
  session = sessionNameDefaulTo(session)
  if (!statusSession[session]) {
    logger.error(`[statusFind-${session}] Session not found`)
    throw new Error(`Session ${session} not found`)
  }
  return statusSession[session].cancelCreation
}

export const cancelCreation = (session?: string) => {
  session = sessionNameDefaulTo(session)
  if (!statusSession[session]) {
    return logger.warn(`[global-${session}] No instance started for ${session}`)
  }
  if (statusSession[session].cancelCreation) {
    return logger.warn(`[statusFind-${session}] Creation already cancelled`)
  }
  if (statusSession[session].created) {
    return logger.warn(`[statusFind-${session}] Creation already created`)
  }
  statusSession[session].cancelCreation = true
}

export const initStatusFind = (session?: string) => {
  session = sessionNameDefaulTo(session)
  if (statusSession[session]) {
    return logger.warn(`[statusFind-${session}] Status already started`)
  }
  statusSession[session] = {
    status: 'initInstance',
    created: false,
    cancelCreation: false,
  }
}

export const setStatusCompleted = (session?: string) => {
  session = sessionNameDefaulTo(session)
  if (!statusSession[session]) {
    return logger.warn(`[global-${session}] No session started for ${session}`)
  }
  statusSession[session].created = true
  statusSession[session].status = 'successChat'
}

const sessionNameDefaulTo = (session?: string) => {
  if (typeof session !== 'string' || !session.replace(/\s/g, '').length) {
    session = 'session'
  }
  return session
}
