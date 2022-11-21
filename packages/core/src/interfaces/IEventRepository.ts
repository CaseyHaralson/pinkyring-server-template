import {BaseEvent} from '../dtos/events';

export default interface IEventRepository {
  publishEvent(event: BaseEvent): Promise<void>;
}
