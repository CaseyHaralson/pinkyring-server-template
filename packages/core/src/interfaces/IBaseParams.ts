import IdempotentRequestHelper from '../util/idempotentRequestHelper';
import Logger from '../util/logger';

export default interface IBaseParams {
  logger: Logger;
  idempotentRequestHelper: IdempotentRequestHelper;
}
