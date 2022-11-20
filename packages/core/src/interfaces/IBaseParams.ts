import IdempotentRequestHelper from '../util/idempotentRequestHelper';
import Logger from './ILogger';

export default interface IBaseParams {
  logger: Logger;
  idempotentRequestHelper: IdempotentRequestHelper;
}
