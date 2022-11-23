import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent} from '@pinkyring/core/dtos/events';
import {SNS} from '@aws-sdk/client-sns';

export default class EventRepository implements IEventRepository {
  async publishEvent(event: BaseEvent): Promise<void> {
    const client = new SNS({});
    await client.publish({
      Message: JSON.stringify(event),
      TopicArn: process.env.BlogPostAddedTopicArn,
    });
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
