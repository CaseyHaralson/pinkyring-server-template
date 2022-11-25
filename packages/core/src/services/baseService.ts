import {BaseEvent} from '../dtos/events';
import Principal from '../dtos/principal';
import IBaseParams from '../interfaces/IBaseParams';
import {ILoggableClass, LogContext} from '../interfaces/ILog';
import {UnknownPrincipal} from '../util/principalResolver';

export default class BaseService implements ILoggableClass {
  private _baseParams;
  protected _logger;
  constructor(baseParams: IBaseParams) {
    this._baseParams = baseParams;
    this._logger = baseParams.logger;
  }

  className(): string {
    return 'BaseService';
  }

  protected async idempotentRequest<T>(
    principal: Principal,
    methodName: string,
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    return this._baseParams.idempotentRequestHelper.handleIdempotentRequest(
      principal,
      this.className(),
      methodName,
      requestId,
      requestFunc
    );
  }

  protected async publishEvent(event: BaseEvent): Promise<boolean> {
    try {
      await this._baseParams.eventHelper.publishEvent(event);
    } catch (e) {
      const lc = {
        currentObj: this,
        methodName: 'publishEvent',
        principal: UnknownPrincipal,
      } as LogContext;
      this._logger.error(lc, `Error publishing event: ${e}`);

      return false;
    }
    return true;
  }
}
