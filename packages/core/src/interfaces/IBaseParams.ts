import EventHelper from '../util/eventHelper';
import IdempotentRequestHelper from '../util/idempotentRequestHelper';
import Logger from '../util/logger';

export default interface IBaseParams {
  logger: Logger;
  idempotentRequestHelper: IdempotentRequestHelper;
  eventHelper: EventHelper;
}
