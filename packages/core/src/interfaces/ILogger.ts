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

  newSubjectLogger(currentObj: ILoggableClass, subject: string) {
    return new SubjectLogger(this._iLogHandler, currentObj, subject);
  }
}

export class SubjectLogger {
  private _iLogHandler;
  private _currentObj;
  private _subject;
  constructor(
    iLogHandler: ILogHandler,
    currentObj: ILoggableClass,
    subject: string
  ) {
    this._iLogHandler = iLogHandler;
    this._currentObj = currentObj;
    this._subject = subject;
  }

  error(message: string) {
    this._iLogHandler.log(
      LogLevel.ERROR,
      this._currentObj,
      message,
      this._subject
    );
  }

  warn(message: string) {
    this._iLogHandler.log(
      LogLevel.WARN,
      this._currentObj,
      message,
      this._subject
    );
  }

  info(message: string) {
    this._iLogHandler.log(
      LogLevel.INFO,
      this._currentObj,
      message,
      this._subject
    );
  }

  debug(message: string) {
    this._iLogHandler.log(
      LogLevel.DEBUG,
      this._currentObj,
      message,
      this._subject
    );
  }
}

export interface ILoggableClass {
  _className(): string;
}

export interface ILogHandler {
  log(level: LogLevel, currentObj: ILoggableClass, message: string): void;
  log(
    level: LogLevel,
    currentObj: ILoggableClass,
    message: string,
    subject: string
  ): void;
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
