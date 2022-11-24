import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent, EventType} from '@pinkyring/core/dtos/events';
import {SNS} from '@aws-sdk/client-sns';
import {SQS} from '@aws-sdk/client-sqs';

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

  async getEventFromQueue(queueName: string): Promise<BaseEvent | null> {
    const client = new SQS({region: process.env.AWS_REGION}); // env variable set by AWS

    console.log(`Trying to get a message from the queue...`);
    const messages = (
      await client.receiveMessage({
        QueueUrl: queueName,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      })
    ).Messages;

    if (messages) {
      console.log(`Received ${messages.length} messages`);
      for (const message of messages) {
        console.log(`Got message: ${JSON.stringify(message)}`);

        //console.log(`Trying to get event from the message`)
      }
    } else {
      console.log(`Didn't receive any messages...`);
    }
    return null;
  }

  getEventCount(queueName: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
