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

    if (configKeys) {
      this.registerNeededConfigurations(configKeys);
    }
  }

  className(): string {
    return this._className;
  }

  private registerNeededConfigurations(configKeys: ConfigKey[]) {
    this._baseParams.configHelper.registerNeededConfigurations(configKeys);
  }

  getConfigValue(keyName: string) {
    return this._baseParams.configHelper.getConfigValue(keyName);
  }
}
