export default interface IIdempotentRequestRepository {
  createRequest(requestId: string): Promise<boolean>;
  saveRequestResult(requestId: string, result: string): Promise<void>;
  getRequestResult(requestId: string): Promise<string | null | undefined>;
  deleteRequest(requestId: string): Promise<void>;
}
