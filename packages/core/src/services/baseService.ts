import {BaseEvent} from '../dtos/events';
import Principal from '../dtos/principal';
import IBaseParams from '../interfaces/IBaseParams';
import {BaseLogContext, ILoggableClass, LogContext} from '../interfaces/ILog';
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

  protected async publishEvent(
    blc: BaseLogContext,
    event: BaseEvent
  ): Promise<boolean> {
    return await this._baseParams.eventHelper.publishEvent(blc, event);
  }
}
