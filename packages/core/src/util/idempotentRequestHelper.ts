import IIdempotentRequestRepository from '../interfaces/IIdempotentRequestRepository';
import Logger, {ILoggableClass} from '../interfaces/ILogger';

export default class IdempotentRequestHelper implements ILoggableClass {
  private _idempotentRequestRepository;
  private _logger;
  constructor(
    idempotentRequestRepository: IIdempotentRequestRepository,
    logger: Logger
  ) {
    this._idempotentRequestRepository = idempotentRequestRepository;
    this._logger = logger;
  }

  _className(): string {
    return 'IdempotentRequestHelper';
  }

  async handleIdempotentRequest<T>(
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    this._logger.debug(this, `trying to create request`);

    const requestCreated =
      await this._idempotentRequestRepository.createRequest(requestId);

    if (requestCreated) {
      this._logger.debug(this, `request created`);

      let result;
      try {
        this._logger.debug(this, `calling the request fuction`);

        result = await requestFunc();
      } catch (e) {
        // something failed in the request handler
        // so delete the request record so the same request can be made again
        this._logger.debug(this, `the request function failed with e: ${e}`);
        this._logger.debug(
          this,
          `deleteing the request record and then throwing the error`
        );

        await this._idempotentRequestRepository.deleteRequest(requestId);
        throw e;
      }

      this._logger.debug(
        this,
        `the request function succeeded so saving the result`
      );

      await this._idempotentRequestRepository.saveRequestResult(
        requestId,
        JSON.stringify(result)
      );
      return result;
    } else {
      // the request has already been made
      // so wait for the request to complete and return the result
      this._logger.debug(this, `the request already exists`);

      return this.waitForIdempotentRequestToComplete(
        requestId,
        requestFunc,
        10000
      );
    }
  }

  async waitForIdempotentRequestToComplete<T>(
    requestId: string,
    requestFunc: () => Promise<T>,
    maxWaitCountMs: number
  ): Promise<T> {
    const sl = this._logger.newSubjectLogger(this, `Additional Request`);
    sl.debug(`checking for the original request result`);

    const result = await this._idempotentRequestRepository.getRequestResult(
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

      return this.handleIdempotentRequest(requestId, requestFunc);
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
