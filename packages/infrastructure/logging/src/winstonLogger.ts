import winston, {format, transports} from 'winston';
import {ILoggableClass, ILogHandler} from '@pinkyring/core/interfaces/ILog';
import {LogLevel} from '@pinkyring/core/dtos/enums';

const logFormat = format.printf((info) => {
  let s = '';
  s = `${info.timestamp} ${info.level}`;
  s += ' ';
  s += info.metadata.class ? `[${info.metadata.class}]` : `[Unknown Class]`;
  s += ': ';
  s += info.metadata.subject ? `${info.metadata.subject} - ` : '';
  s += `${info.message}`;
  return s;
});

export default class WinstonLogger implements ILogHandler {
  private _logger;
  constructor() {
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
          format: format.combine(format.colorize(), logFormat),
        }),
      ],
    });
  }

  log(level: LogLevel, currentObj: ILoggableClass, message: string): void;
  log(
    level: LogLevel,
    currentObj: ILoggableClass,
    message: string,
    subject: string
  ): void;
  log(
    level: LogLevel,
    currentObj: ILoggableClass,
    message: string,
    subject?: string
  ): void {
    const meta = {
      class: currentObj._className(),
      subject: subject,
    };

    if (level == LogLevel.ERROR) this._logger.error(message, meta);
    else if (level == LogLevel.WARN) this._logger.warn(message, meta);
    else if (level == LogLevel.INFO) this._logger.info(message, meta);
    else if (level == LogLevel.DEBUG) this._logger.debug(message, meta);
  }
}
