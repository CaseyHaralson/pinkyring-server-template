import {LogLevel} from '../dtos/enums';
import {ILoggableClass, ILogHandler} from '../interfaces/ILog';

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
