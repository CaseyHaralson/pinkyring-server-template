import Logger from './ILogger';

export default interface IBaseParams {
  logger: Logger;
  idempotentRequestRepository: IIdempotentRequestRepository;
}

export interface IIdempotentRequestRepository {
  createRequest(requestId: string): Promise<boolean>;
  saveRequestResult(requestId: string, result: string): Promise<void>;
  getRequestResult(requestId: string): Promise<string | null | undefined>;
  deleteRequest(requestId: string): Promise<void>;
}
