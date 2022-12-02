import {ILogHandler, LogContext, LogLevel} from '../interfaces/ILog';

export default class Logger {
  private _iLogHandler;
  constructor(iLogHandler: ILogHandler) {
    this._iLogHandler = iLogHandler;
  }

  error(context: LogContext, message: string) {
    this._iLogHandler.log(LogLevel.ERROR, context, message);
  }

  warn(context: LogContext, message: string) {
    this._iLogHandler.log(LogLevel.WARN, context, message);
  }

  info(context: LogContext, message: string) {
    this._iLogHandler.log(LogLevel.INFO, context, message);
  }

  debug(context: LogContext, message: string) {
    this._iLogHandler.log(LogLevel.DEBUG, context, message);
  }
}
