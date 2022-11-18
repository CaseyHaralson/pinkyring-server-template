export default class Logger {
  private _iLogHandler;
  constructor(iLogHandler: ILogHandler) {
    this._iLogHandler = iLogHandler;
  }

  error(currentObj: ILoggableClass, message: string) {
    this._iLogHandler.log(LogLevel.ERROR, currentObj, message);
  }

  warn(currentObj: ILoggableClass, message: string) {
    this._iLogHandler.log(LogLevel.WARN, currentObj, message);
  }

  info(currentObj: ILoggableClass, message: string) {
    this._iLogHandler.log(LogLevel.INFO, currentObj, message);
  }

  debug(currentObj: ILoggableClass, message: string) {
    this._iLogHandler.log(LogLevel.DEBUG, currentObj, message);
  }
}

export interface ILoggableClass {
  _className(): string;
}

export interface ILogHandler {
  log(level: LogLevel, currentObj: ILoggableClass, message: string): void;
}

// datetime
// level
// message
// object
// type
//

// it would be nice to know this info, but not sure how to do it without lots of weird code
// graphql yoga -> core graphql -> blog service -> base service

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}
