import {
  ILoggableClass,
  ILogHandler,
  LogContext,
  LogLevel,
} from '../interfaces/ILog';
import ISessionHandler from '../interfaces/ISession';

// can't extend the BaseClass because the base class needs this object as a parameter
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

  error(message: string) {
    const context = this.getLogContext();
    this._logHandler.log(LogLevel.ERROR, context, message);
  }

  warn(message: string) {
    const context = this.getLogContext();
    this._logHandler.log(LogLevel.WARN, context, message);
  }

  info(message: string) {
    const context = this.getLogContext();
    this._logHandler.log(LogLevel.INFO, context, message);
  }

  debug(message: string) {
    const context = this.getLogContext();
    this._logHandler.log(LogLevel.DEBUG, context, message);
  }

  private getLogContext() {
    const session = this._sessionHandler.getSession();
    const context = {
      sessionId: session.sessionId,
      principal: session.principal,
      currentObj: this._loggableClass,
    } as LogContext;
    return context;
  }
}
