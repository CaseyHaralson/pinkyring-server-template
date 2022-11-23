import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent} from '@pinkyring/core/dtos/events';

export default class EventRepository implements IEventRepository {
  publishEvent(event: BaseEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createQueue(
    queueName: string,
    busName?: string | undefined,
    topicPattern?: string | undefined
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  listenForEvents(
    queueName: string,
    handlerFunc: (event: BaseEvent) => Promise<boolean>
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getEventFromQueue(queueName: string): Promise<BaseEvent | null> {
    throw new Error('Method not implemented.');
  }
  getEventCount(queueName: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
