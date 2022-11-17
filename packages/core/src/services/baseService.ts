import IBaseParams from '../interfaces/IBaseParams';

export default class BaseService {
  private _baseParams;
  constructor(baseParams: IBaseParams) {
    this._baseParams = baseParams;
  }

  async idempotentRequest<T>(
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    const requestCreated =
      await this._baseParams.requestRepository.createRequest(requestId);

    if (requestCreated) {
      let result;
      try {
        result = await requestFunc();
      } catch (e) {
        // something failed in the request handler
        // so delete the request record so the same request can be made again
        await this._baseParams.requestRepository.deleteRequest(requestId);
        throw e;
      }

      await this._baseParams.requestRepository.saveRequestResult(
        requestId,
        JSON.stringify(result)
      );
      return result;
    } else {
      // the request has already been made
      // so wait for the request to complete and return the result
      return this.waitForRequestToComplete(requestId, requestFunc, 10000);
    }
  }

  private async waitForRequestToComplete<T>(
    requestId: string,
    requestFunc: () => Promise<T>,
    maxWaitCountMs: number
  ): Promise<T> {
    const result = await this._baseParams.requestRepository.getRequestResult(
      requestId
    );
    if (result) return JSON.parse(result) as T;
    if (result === undefined) {
      // something happened to the original request
      // so we need to make the request again
      return this.idempotentRequest(requestId, requestFunc);
    }
    if (result === null) {
      // the original request hasn't finished
      // so wait and check again
      if (maxWaitCountMs < 0)
        throw Error(
          `Request timeout - the max amount of time to wait for the request to complete has elapsed.`
        );

      return await this.snooze(() => {
        return this.waitForRequestToComplete(
          requestId,
          requestFunc,
          maxWaitCountMs - 100
        );
      }, 100);
    }
    throw new Error(`Unknown state - The request couldn't be found.`);
  }

  private snooze<T>(callback: () => Promise<T>, snoozeMs: number) {
    return new Promise<T>(function (resolve) {
      setTimeout(function () {
        resolve(callback());
      }, snoozeMs);
    });
  }
}
