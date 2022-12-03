import winston, {format, transports} from 'winston';
import {
  ILogHandler,
  LogContext,
  LogLevel,
} from '@pinkyring/core/interfaces/ILog';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';
import {CONFIGKEYNAME_PROJECTDATA_PREFIX} from '@pinkyring/core/interfaces/IConfig';
import {Environment} from '@pinkyring/core/util/configHelper';

const CONFIGKEYNAME_PROJECT_NAME = `${CONFIGKEYNAME_PROJECTDATA_PREFIX}NAME`;
const CONFIGKEYNAME_PROJECT_VERSION = `${CONFIGKEYNAME_PROJECTDATA_PREFIX}VERSION`;

// when changing the log format
// make sure that whatever is parsing the logs can handle the new format

const logFormat = format.printf((info) => {
  let s = '';
  s = `${info.timestamp}`;
  s += ' ';
  s += `${info.metadata.env}`;
  s += ' ';
  s += `${info.level}`;
  s += ' ';

  if (info.metadata.projectName) {
    s += `[${info.metadata.projectName}`;
    s += info.metadata.projectVersion
      ? `:${info.metadata.projectVersion}]`
      : ']';
  } else {
    s += '[]';
  }

  if (info.metadata.packageName) {
    s += `[${info.metadata.packageName}`;
    s += info.metadata.packageVersion ? `:${info.metadata.packageVersion}` : ``;
    s += '.';
  } else {
    s += `[Unknown Package.`;
  }

  s += info.metadata.context?.currentObj
    ? `${info.metadata.context.currentObj.className()}]`
    : `Unknown Class]`;

  if (info.metadata.context?.sessionId) {
    s += `[Session:${info.metadata.context.sessionId}]`;
    s += ': ';
  } else {
    s += '[]: ';
  }

  if (info.metadata.context?.subject) {
    s += `${info.metadata.context.subject} - `;
  }

  s += `${info.message}`;
  s += ' ... ';

  if (info.metadata.context?.principal) {
    s += `Principal: ${JSON.stringify(info.metadata.context?.principal)}`;
  }

  return s;
});

export default class WinstonLogger extends BaseClass implements ILogHandler {
  private _realLogger;
  constructor(baseParams: IBaseParams) {
    super(baseParams, 'WinstonLogger', [
      {
        name: CONFIGKEYNAME_PROJECT_NAME,
      },
      {
        name: CONFIGKEYNAME_PROJECT_VERSION,
      },
    ]);

    let consoleFormat = format.combine(logFormat);
    if (this.getEnvironment() === Environment.DEVELOPMENT) {
      consoleFormat = format.combine(format.colorize(), logFormat);
    }

    this._realLogger = winston.createLogger({
      level:
        this.getEnvironment() === Environment.PRODUCTION ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        // Format the metadata object
        format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        })
      ),
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
      ],
    });
  }

  log(level: LogLevel, context: LogContext, message: string): void {
    const meta = {
      env: this.getEnvironment(),
      projectName: this.getConfigValue(CONFIGKEYNAME_PROJECT_NAME),
      projectVersion: this.getConfigValue(CONFIGKEYNAME_PROJECT_VERSION),
      packageName: process.env.npm_package_name,
      packageVersion: process.env.npm_package_version,
      context: context,
    };

    if (level == LogLevel.ERROR) this._realLogger.error(message, meta);
    else if (level == LogLevel.WARN) this._realLogger.warn(message, meta);
    else if (level == LogLevel.INFO) this._realLogger.info(message, meta);
    else if (level == LogLevel.DEBUG) this._realLogger.debug(message, meta);
  }
}
