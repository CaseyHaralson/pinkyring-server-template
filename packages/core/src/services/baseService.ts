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
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    return this._baseParams.idempotentRequestHelper.handleIdempotentRequest(
      requestId,
      requestFunc
    );
  }

  protected specifyRequestId(
    principal: Principal,
    functionName: string,
    requestId: string
  ) {
    return `${
      principal.identity.id
    }.${this._className()}.${functionName}.${requestId}`;
  }
}
