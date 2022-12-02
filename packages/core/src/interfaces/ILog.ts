import {LogLevel} from '../dtos/enums';
import Principal from '../dtos/principal';

export interface ILoggableClass {
  className(): string;
}

export interface ILogHandler {
  log(level: LogLevel, context: LogContext, message: string): void;
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
