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
  logNew(level: LogLevel, context: NewLogContext, message: string): void;
}

export interface BaseLogContext {
  principal: Principal;
  requestId?: string;
}

export interface LogContext extends BaseLogContext {
  currentObj: ILoggableClass;
  methodName: string;
  subject?: string;
}

export interface NewLogContext {
  principal: Principal;
  requestId: string;
  currentObj: ILoggableClass;
}
