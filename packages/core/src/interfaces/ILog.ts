import {LogLevel} from '../dtos/enums';

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
