import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent, EventType} from '@pinkyring/core/dtos/events';
import {SNS} from '@aws-sdk/client-sns';

export default class EventRepository implements IEventRepository {
  async publishEvent(event: BaseEvent): Promise<void> {
    let topicArn = undefined;
    if (event.eventType === EventType.BLOG_POST_ADDED) {
      topicArn = process.env.BlogPostAddedTopicArn;
    }

    if (topicArn) {
      const client = new SNS({region: process.env.AWS_REGION}); // env variable set by AWS
      await client.publish({
        Message: JSON.stringify(event),
        TopicArn: topicArn,
        MessageGroupId: event.eventType,
      });
    }
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
