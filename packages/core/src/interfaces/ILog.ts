import {LogLevel} from '../dtos/enums';
import Principal from '../dtos/principal';

export interface ILoggableClass {
  _className(): string;
}

export interface ILogHandler {
  log(level: LogLevel, context: LogContext, message: string): void;
}

export interface LogContext {
  principal: Principal;
  currentObj: ILoggableClass;
  methodName: string;
  subject?: string;
  requestId?: string;
}
