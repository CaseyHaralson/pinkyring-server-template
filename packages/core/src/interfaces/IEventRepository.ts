import {BaseEvent} from '../dtos/events';

export default interface IEventRepository {
  publishEvent(event: BaseEvent): Promise<void>;
  createQueue(
    queueName: string,
    busName?: string,
    topicPattern?: string
  ): Promise<void>;
  listenForMessages(
    queueName: string,
    handlerFunc: (event: BaseEvent) => Promise<boolean>
  ): Promise<void>;
}
