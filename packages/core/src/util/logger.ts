import {
  ILoggableClass,
  ILogHandler,
  LogContext,
  LogLevel,
  NewLogContext,
} from '../interfaces/ILog';
import ISessionHandler from '../interfaces/ISession';

export default class Logger {
  private _logHandler;
  private _sessionHandler;
  constructor(logHandler: ILogHandler, sessionHandler: ISessionHandler) {
    this._logHandler = logHandler;
    this._sessionHandler = sessionHandler;
  }

  private _loggableClass!: ILoggableClass;
  setLoggableClass(currentObj: ILoggableClass) {
    this._loggableClass = currentObj;
  }

  error(context: LogContext, message: string) {
    this._logHandler.log(LogLevel.ERROR, context, message);
  }

  warn(context: LogContext, message: string) {
    this._logHandler.log(LogLevel.WARN, context, message);
  }

  info(context: LogContext, message: string) {
    this._logHandler.log(LogLevel.INFO, context, message);
  }

  debug(context: LogContext, message: string) {
    this._logHandler.log(LogLevel.DEBUG, context, message);
  }

  test(message: string) {
    const session = this._sessionHandler.getSession();
    const context = {
      principal: session.principal,
      requestId: session.requestId,
      currentObj: this._loggableClass,
    } as NewLogContext;
    this._logHandler.logNew(LogLevel.DEBUG, context, message);
  }
}
