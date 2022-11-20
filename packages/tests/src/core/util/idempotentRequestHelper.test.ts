import IIdempotentRequestRepository from '@pinkyring/core/interfaces/IIdempotentRequestRepository';
import Logger, {SubjectLogger} from '@pinkyring/core/interfaces/ILogger';
import IdempotentRequestHelper from '@pinkyring/core/util/idempotentRequestHelper';
import {mock, mockReset} from 'jest-mock-extended';

describe('idempotent request helper unit tests', () => {
  const repo = mock<IIdempotentRequestRepository>();
  const logger = mock<Logger>();
  const helper = new IdempotentRequestHelper(repo, logger);

  beforeEach(() => {
    mockReset(repo);
    mockReset(logger);
    logger.newSubjectLogger.mockImplementation(() => {
      return mock<SubjectLogger>();
    });
  });

  describe('handle idempotent request function', () => {
    describe('first request by id', () => {
      beforeEach(() => {
        repo.createRequest.mockResolvedValue(true);
      });

      test('returns the request func result', async () => {
        const requestId = 'test_request_1234';
        const requestResult = {someResult: true};
        const requestFunc = jest.fn(() => {
          return Promise.resolve(requestResult);
        });
        const result = await helper.handleIdempotentRequest(
          requestId,
          requestFunc
        );

        expect(result).toBe(requestResult);
        expect(requestFunc).toBeCalledTimes(1);
      });

      test('saves the request func result', async () => {
        const requestId = 'test_request_1234';
        const requestResult = {someResult: true};
        const requestFunc = jest.fn(() => {
          return Promise.resolve(requestResult);
        });
        await helper.handleIdempotentRequest(requestId, requestFunc);

        expect(repo.saveRequestResult).toBeCalledTimes(1);
        expect(repo.saveRequestResult).toBeCalledWith(
          requestId,
          JSON.stringify(requestResult)
        );
      });

      test('deletes the request if something unexpected happens in the request func', async () => {
        const requestId = 'test_request_1234';
        const exception = 'something unexpected';
        const requestFunc = jest.fn(() => {
          throw Error(exception);
        });
        try {
          await helper.handleIdempotentRequest(requestId, requestFunc);
        } catch (e) {
          expect((e as Error).message).toBe(exception);
        }

        expect(repo.deleteRequest).toBeCalledTimes(1);
        expect(repo.deleteRequest).toBeCalledWith(requestId);
      });
    });

    describe('subsequent requests by id', () => {
      beforeEach(() => {
        repo.createRequest.mockResolvedValue(false);
      });

      test('returns the saved result if it exists and doesnt call request func a second time', async () => {
        const requestId = 'test_request_1234';
        const requestResult = {someResult: true};
        const requestFunc = jest.fn(() => {
          return Promise.resolve(requestResult);
        });
        repo.getRequestResult.mockResolvedValue(JSON.stringify(requestResult));
        const result = await helper.handleIdempotentRequest(
          requestId,
          requestFunc
        );

        expect(result).toStrictEqual(requestResult);
        expect(requestFunc).toBeCalledTimes(0);
      });

      test('calls the request func if something happened to the original request', async () => {
        repo.createRequest.mockResolvedValueOnce(false);
        repo.createRequest.mockResolvedValueOnce(true);

        const requestId = 'test_request_1234';
        const requestResult = {someResult: true};
        const requestFunc = jest.fn(() => {
          return Promise.resolve(requestResult);
        });
        repo.getRequestResult.mockResolvedValue(undefined);
        const result = await helper.handleIdempotentRequest(
          requestId,
          requestFunc
        );

        expect(repo.getRequestResult).toBeCalledTimes(1);
        expect(result).toBe(requestResult);
        expect(requestFunc).toBeCalledTimes(1);
      });

      test('waits till the first request finishes and then returns the saved result', async () => {
        const requestId = 'test_request_1234';
        const requestResult = {someResult: true};
        const requestFunc = jest.fn(() => {
          return Promise.resolve(requestResult);
        });
        repo.getRequestResult.mockResolvedValueOnce(null);
        repo.getRequestResult.mockResolvedValueOnce(
          JSON.stringify(requestResult)
        );
        const result = await helper.handleIdempotentRequest(
          requestId,
          requestFunc
        );

        expect(repo.getRequestResult).toBeCalledTimes(2);
        expect(result).toStrictEqual(requestResult);
        expect(requestFunc).toBeCalledTimes(0);
      });
    });
  });
});
