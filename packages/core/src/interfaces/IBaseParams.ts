export default interface IBaseParams {
  requestRepostiory: IRequestRepository;
}

export interface IRequestRepository {
  createRequest(requestId: string): Promise<boolean>;
  saveRequestResult(requestId: string, result: string): Promise<void>;
  getRequestResult(requestId: string): Promise<string>;
}
