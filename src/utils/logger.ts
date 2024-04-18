import pino from 'pino'

export let logger

export const configureLogger = (loggerOptions: pino.LoggerOptions) => {
  logger = pino(loggerOptions)
}
