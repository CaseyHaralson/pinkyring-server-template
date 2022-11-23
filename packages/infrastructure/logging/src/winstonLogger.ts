import winston, {format, transports} from 'winston';
import {ILogHandler, LogContext} from '@pinkyring/core/interfaces/ILog';
import {LogLevel} from '@pinkyring/core/dtos/enums';

const logFormat = format.printf((info) => {
  let s = '';
  s = `${info.timestamp}`;
  s += ' ';
  s += info.metadata.env ? `${info.metadata.env}` : `dev`;
  s += ' ';
  s += `${info.level}`;
  s += ' ';
  s += info.metadata.projectName
    ? `[${info.metadata.projectName}`
    : `[Unknown Project`;
  s += info.metadata.projectVersion ? `:${info.metadata.projectVersion}` : ``;
  s += info.metadata.context?.currentObj
    ? `.${info.metadata.context.currentObj._className()}`
    : `.Unknown Class`;
  s += info.metadata.context?.methodName
    ? `.${info.metadata.context.methodName}]`
    : `.Unknown Function]`;
  s += info.metadata.context?.requestId
    ? `[${info.metadata.context.requestId}]`
    : ``;
  s += ': ';
  s += info.metadata.context?.subject
    ? `${info.metadata.context.subject} - `
    : '';
  s += `${info.message}`;
  s += ' ... ';
  s += info.metadata.context?.principal
    ? `Principal: ${JSON.stringify(info.metadata.context?.principal)}`
    : ``;
  return s;
});

export default class WinstonLogger implements ILogHandler {
  private _logger;
  constructor() {
    let consoleFormat = format.combine(logFormat);
    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') {
      consoleFormat = format.combine(format.colorize(), logFormat);
    }

    this._logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        // Format the metadata object
        format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        })
      ),
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
      ],
    });
  }

  log(level: LogLevel, context: LogContext, message: string): void {
    const meta = {
      env: process.env.NODE_ENV,
      projectName: process.env.npm_package_name,
      projectVersion: process.env.npm_package_version,
      context: context,
    };

    if (level == LogLevel.ERROR) this._logger.error(message, meta);
    else if (level == LogLevel.WARN) this._logger.warn(message, meta);
    else if (level == LogLevel.INFO) this._logger.info(message, meta);
    else if (level == LogLevel.DEBUG) this._logger.debug(message, meta);
  }
}
