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
    let queueUrl = undefined;
    if (queueName === 'ManualPullQueue') {
      queueUrl = process.env.ManualPullQueueUrl;
    }

    if (queueUrl) {
      const client = new SQS({region: process.env.AWS_REGION}); // env variable set by AWS

      console.log(`Trying to get a message from the queue...`);
      const messageOutput = await client.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });
      const messages = messageOutput.Messages;

      if (messages) {
        console.log(`Received ${messages.length} messages`);
        for (const message of messages) {
          console.log(`Got message: ${JSON.stringify(message)}`);
          const messageBody = message.Body;

          if (messageBody) {
            const messageBodyObj = JSON.parse(messageBody);

            console.log(`Trying to get event from the message`);
            const event = JSON.parse(messageBodyObj.Message) as BaseEvent;
            console.log(`Parsed event from record: ${event.eventType}`);
            return event;
          }
        }
      } else {
        console.log(`Didn't receive any messages...`);
      }
    }
    return null;
  }

  async getNumEventsInQueue(queueName: string): Promise<number> {
    let queueUrl = undefined;
    if (queueName === 'ManualPullQueue') {
      queueUrl = process.env.ManualPullQueueUrl;
    }

    if (queueUrl) {
      const client = new SQS({region: process.env.AWS_REGION}); // env variable set by AWS

      console.log(`Trying to get attributes from the queue...`);
      const attributes = await client.getQueueAttributes({
        QueueUrl: queueUrl,
        AttributeNames: ['ApproximateNumberOfMessages'],
      });

      console.log(`Received the following attriburtes: ${attributes}`);
    }

    return 0;
  }
}
