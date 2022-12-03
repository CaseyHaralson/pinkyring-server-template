import {ConfigKey} from '../interfaces/IConfig';
import {ILoggableClass} from '../interfaces/ILog';
import ConfigHelper from './configHelper';
import Logger from './logger';

export interface IBaseParams {
  logger: Logger;
  configHelper: ConfigHelper;
}

export default class BaseClass implements ILoggableClass {
  private _baseParams;
  private _className;
  protected _logger;
  constructor(
    baseParams: IBaseParams,
    className: string,
    configKeys?: ConfigKey[]
  ) {
    this._baseParams = baseParams;
    this._className = className;
    this._logger = baseParams.logger;

    if (this._logger) {
      this.setLoggerValues();
    }

    if (configKeys) {
      this.registerNeededConfigurations(configKeys);
    }
  }

  className(): string {
    return this._className;
  }

  private setLoggerValues() {
    this._logger.setLoggableClass(this);
  }

  private registerNeededConfigurations(configKeys: ConfigKey[]) {
    this._baseParams.configHelper.registerNeededConfigurations(configKeys);
  }

  protected getConfigValue(keyName: string) {
    return this._baseParams.configHelper.getConfigValue(keyName);
  }

  protected getEnvironment() {
    return this._baseParams.configHelper.getEnvironment();
  }
}
