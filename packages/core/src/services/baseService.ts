import {BaseEvent} from '../dtos/events';
import Principal from '../interfaces/IPrincipal';
import {ConfigKey} from '../interfaces/IConfig';
import {BaseLogContext} from '../interfaces/ILog';
import BaseClass, {IBaseParams} from '../util/baseClass';
import EventHelper from '../util/eventHelper';
import IdempotentRequestHelper from '../util/idempotentRequestHelper';
import ISessionHandler from '../interfaces/ISession';

export interface IBaseServiceParams extends IBaseParams {
  idempotentRequestHelper: IdempotentRequestHelper;
  eventHelper: EventHelper;
  sessionHandler: ISessionHandler;
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

  protected async session<T>(
    principal: Principal,
    func: () => Promise<T>
  ): Promise<T> {
    return this._baseServiceParams.sessionHandler.newSession(principal, func);
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
