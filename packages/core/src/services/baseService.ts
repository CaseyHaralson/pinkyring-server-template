import {BaseEvent} from '../dtos/events';
import Principal from '../dtos/principal';
import IBaseParams from '../interfaces/IBaseParams';
import {ILoggableClass} from '../interfaces/ILog';

export default class BaseService implements ILoggableClass {
  private _baseParams;
  protected _logger;
  constructor(baseParams: IBaseParams) {
    this._baseParams = baseParams;
    this._logger = baseParams.logger;
  }

  _className(): string {
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
      this._className(),
      methodName,
      requestId,
      requestFunc
    );
  }

  protected async publishEvent(event: BaseEvent) {
    await this._baseParams.eventHelper.publishEvent(event);
  }
}
