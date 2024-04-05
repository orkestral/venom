import pino from 'pino'

const logLevel = process.env.LOG_LEVEL || 'debug'
const isProductionEnv = process.env.NODE_ENV === 'production'

const transport = isProductionEnv
  ? null
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    }

export const logger = pino({
  level: logLevel,
  transport,
})
