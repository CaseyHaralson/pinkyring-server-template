import {BaseEvent} from '../dtos/events';
import Principal from '../dtos/principal';
import {ConfigKey} from '../interfaces/IConfig';
import {BaseLogContext} from '../interfaces/ILog';
import BaseClass, {IBaseParams} from '../util/baseClass';
import EventHelper from '../util/eventHelper';
import IdempotentRequestHelper from '../util/idempotentRequestHelper';

export interface IBaseServiceParams extends IBaseParams {
  idempotentRequestHelper: IdempotentRequestHelper;
  eventHelper: EventHelper;
}

export default class BaseService extends BaseClass {
  protected _baseServiceParams;
  constructor(
    baseServiceParams: IBaseServiceParams,
    className: string,
    configKeys?: ConfigKey[]
  ) {
    super(baseServiceParams, className, configKeys);
    this._baseServiceParams = baseServiceParams;
  }

  protected async idempotentRequest<T>(
    principal: Principal,
    methodName: string,
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    return this._baseServiceParams.idempotentRequestHelper.handleIdempotentRequest(
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
    return await this._baseServiceParams.eventHelper.publishEvent(blc, event);
  }
}
