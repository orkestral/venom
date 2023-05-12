import { config, createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';

export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export interface MetaInfo {
  session?: string;
  type?: string;
}

export interface SessionInfo extends TransformableInfo, MetaInfo {}

export const formatLabelSession = format((info: SessionInfo) => {
  const parts = [];
  if (info.session) {
    parts.push(info.session);
    delete info.session;
  }
  if (info.type) {
    parts.push(info.type);
    delete info.type;
  }

  if (parts.length) {
    let prefix = parts.join(':');
    info.message = `[${prefix}] ${info.message}`;
  }
  return info;
});

export const defaultLogger = createLogger({
  level: 'info',
  levels: config.npm.levels,
  format: format.combine(
    formatLabelSession(),
    format.colorize(),
    format.padLevels(),
    format.simple()
  ),
  //   defaultMeta: { service: 'venon-bot' },
  transports: [new transports.Console()]
});
