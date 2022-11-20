import Principal from '../dtos/principal';
import IIdempotentRequestRepository from '../interfaces/IIdempotentRequestRepository';
import {ILoggableClass, LogContext} from '../interfaces/ILog';
import Logger from './logger';

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
    principal: Principal,
    originatingClassName: string,
    originatingMethodName: string,
    requestId: string,
    requestFunc: () => Promise<T>
  ): Promise<T> {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'handleIdempotentRequest',
      requestId: requestId,
    } as LogContext;

    this._logger.debug(lc, `trying to create request`);

    const specificRequestId = this.specifyRequestId(
      principal,
      originatingClassName,
      originatingMethodName,
      requestId
    );

    const requestCreated =
      await this._idempotentRequestRepository.createRequest(specificRequestId);

    if (requestCreated) {
      this._logger.debug(lc, `request created`);

      let result;
      try {
        this._logger.debug(lc, `calling the request fuction`);

        result = await requestFunc();
      } catch (e) {
        // something failed in the request handler
        // so delete the request record so the same request can be made again
        this._logger.debug(lc, `the request function failed with e: ${e}`);
        this._logger.debug(
          lc,
          `deleteing the request record and then throwing the error`
        );

        await this._idempotentRequestRepository.deleteRequest(
          specificRequestId
        );
        throw e;
      }

      this._logger.debug(
        lc,
        `the request function succeeded so saving the result`
      );

      await this._idempotentRequestRepository.saveRequestResult(
        specificRequestId,
        JSON.stringify(result)
      );
      return result;
    } else {
      // the request has already been made
      // so wait for the request to complete and return the result
      this._logger.debug(lc, `the request already exists`);

      return this.waitForIdempotentRequestToComplete(
        principal,
        originatingClassName,
        originatingMethodName,
        requestId,
        requestFunc,
        10000
      );
    }
  }

  private async waitForIdempotentRequestToComplete<T>(
    principal: Principal,
    originatingClassName: string,
    originatingMethodName: string,
    requestId: string,
    requestFunc: () => Promise<T>,
    maxWaitCountMs: number
  ): Promise<T> {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'waitForIdempotentRequestToComplete',
      requestId: requestId,
      subject: 'Additional Request',
    } as LogContext;

    this._logger.debug(lc, `checking for the original request result`);

    const specificRequestId = this.specifyRequestId(
      principal,
      originatingClassName,
      originatingMethodName,
      requestId
    );

    const result = await this._idempotentRequestRepository.getRequestResult(
      specificRequestId
    );
    if (result) {
      this._logger.debug(
        lc,
        `the original request result was found so returning result`
      );

      return JSON.parse(result) as T;
    }
    if (result === undefined) {
      // something happened to the original request
      // so we need to make the request again
      this._logger.debug(
        lc,
        `the original request had an issue so making the request again`
      );

      return this.handleIdempotentRequest(
        principal,
        originatingClassName,
        originatingMethodName,
        requestId,
        requestFunc
      );
    }
    if (result === null) {
      // the original request hasn't finished
      // so wait and check again
      this._logger.debug(
        lc,
        `the original request hasn't completed so waiting before checking on the result again`
      );

      if (maxWaitCountMs < 0) {
        this._logger.debug(
          lc,
          `the max wait time has elapsed so going to throw an error`
        );

        throw Error(
          `Request timeout - the max amount of time to wait for the request to complete has elapsed.`
        );
      }

      return await this.snooze(() => {
        return this.waitForIdempotentRequestToComplete(
          principal,
          originatingClassName,
          originatingMethodName,
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

  specifyRequestId(
    principal: Principal,
    originatingClassName: string,
    originatingMethodName: string,
    requestId: string
  ) {
    return `${principal.identity.id}.${originatingClassName}.${originatingMethodName}.${requestId}`;
  }
}
