import IBaseParams from '../interfaces/IBaseParams';

export default class BaseService {
  private _baseParams;
  constructor(baseParams: IBaseParams) {
    this._baseParams = baseParams;
  }

  async idempotentRequest<T>(
    requestId: string,
    func: () => Promise<T>
  ): Promise<T> {
    // TODO: add some retry logic in here
    // and try catch around the main func, so can delete request if it doesn't succeed

    const requestCreated =
      await this._baseParams.requestRepository.createRequest(requestId);

    if (requestCreated) {
      const result = await func();
      await this._baseParams.requestRepository.saveRequestResult(
        requestId,
        JSON.stringify(result)
      );
      return result;
    } else {
      const result = await this._baseParams.requestRepository.getRequestResult(
        requestId
      );
      if (result) return JSON.parse(result) as T;
      throw new Error(`Can't find result for request ${requestId}`);
    }
  }
}
