import IBaseParams from '../interfaces/IBaseParams';
import {ILoggableClass} from '../interfaces/ILogger';

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
    const sl = this._logger.newSubjectLogger(this, `Idempotent Request`);
    sl.debug(`trying to create request`);

    const requestCreated =
      await this._baseParams.idempotentRequestRepository.createRequest(
        requestId
      );

    if (requestCreated) {
      sl.debug(`request created`);

      let result;
      try {
        sl.debug(`calling the request fuction`);

        result = await requestFunc();
      } catch (e) {
        // something failed in the request handler
        // so delete the request record so the same request can be made again
        sl.debug(`the request function failed with e: ${e}`);
        sl.debug(`deleteing the request record and then throwing the error`);

        await this._baseParams.idempotentRequestRepository.deleteRequest(
          requestId
        );
        throw e;
      }

      sl.debug(`the request function succeeded so saving the result`);

      await this._baseParams.idempotentRequestRepository.saveRequestResult(
        requestId,
        JSON.stringify(result)
      );
      return result;
    } else {
      // the request has already been made
      // so wait for the request to complete and return the result
      sl.debug(`the request already exists`);

      return this.waitForIdempotentRequestToComplete(
        requestId,
        requestFunc,
        10000
      );
    }
  }

  private async waitForIdempotentRequestToComplete<T>(
    requestId: string,
    requestFunc: () => Promise<T>,
    maxWaitCountMs: number
  ): Promise<T> {
    const sl = this._logger.newSubjectLogger(
      this,
      `Idempotent Request - Additional Request`
    );
    sl.debug(`checking for the original request result`);

    const result =
      await this._baseParams.idempotentRequestRepository.getRequestResult(
        requestId
      );
    if (result) {
      sl.debug(`the original request result was found so returning result`);

      return JSON.parse(result) as T;
    }
    if (result === undefined) {
      // something happened to the original request
      // so we need to make the request again
      sl.debug(`the original request had an issue so making the request again`);

      return this.idempotentRequest(requestId, requestFunc);
    }
    if (result === null) {
      // the original request hasn't finished
      // so wait and check again
      sl.debug(
        `the original request hasn't completed so waiting before checking on the result again`
      );

      if (maxWaitCountMs < 0) {
        sl.debug(`the max wait time has elapsed so going to throw an error`);

        throw Error(
          `Request timeout - the max amount of time to wait for the request to complete has elapsed.`
        );
      }

      return await this.snooze(() => {
        return this.waitForIdempotentRequestToComplete(
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
