import Principal from './IPrincipal';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface ILoggableClass {
  className(): string;
}

export interface ILogHandler {
  log(level: LogLevel, context: LogContext, message: string): void;
}

export interface LogContext {
  sessionId: string;
  principal: Principal;
  currentObj: ILoggableClass;
}
