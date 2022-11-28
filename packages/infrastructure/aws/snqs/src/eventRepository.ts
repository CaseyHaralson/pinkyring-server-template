import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent, EventType} from '@pinkyring/core/dtos/events';
import {SNS} from '@aws-sdk/client-sns';
import {SQS} from '@aws-sdk/client-sqs';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';
import {LogContext} from '@pinkyring/core/interfaces/ILog';
import {UnknownPrincipal} from '@pinkyring/core/util/principalResolver';

const CONFIGKEYNAME_AWS_REGION = 'AWS_REGION'; // env variable set by AWS
const CONFIGKEYNAME_BLOGPOST_ADDED_TOPIC_ARN = 'BLOGPOST_ADDED_TOPIC_ARN';
const CONFIGKEYNAME_MANUAL_PULL_QUEUE_URL = 'MANUAL_PULL_QUEUE_URL';

export default class EventRepository
  extends BaseClass
  implements IEventRepository
{
  constructor(baseParams: IBaseParams) {
    super(baseParams, 'EventRepository', [
      {
        name: CONFIGKEYNAME_AWS_REGION,
      },
      {
        name: CONFIGKEYNAME_BLOGPOST_ADDED_TOPIC_ARN,
      },
      {
        name: CONFIGKEYNAME_MANUAL_PULL_QUEUE_URL,
      },
    ]);
  }

  async publishEvent(event: BaseEvent): Promise<void> {
    let topicArn = undefined;
    if (event.eventType === EventType.BLOG_POST_ADDED) {
      topicArn = this.getConfigValue(CONFIGKEYNAME_BLOGPOST_ADDED_TOPIC_ARN);
    }

    if (topicArn) {
      const client = new SNS({
        region: this.getConfigValue(CONFIGKEYNAME_AWS_REGION),
      });
      await client.publish({
        Message: JSON.stringify(event),
        TopicArn: topicArn,
        MessageGroupId: event.eventType,
      });
    }
  }

  createQueue(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  listenForEvents(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getEventFromQueue(queueName: string): Promise<BaseEvent | null> {
    const lc = {
      principal: UnknownPrincipal,
      currentObj: this,
      methodName: 'getEventFromQueue',
    } as LogContext;

    let queueUrl = undefined;
    if (queueName === 'ManualPullQueue') {
      queueUrl = this.getConfigValue(CONFIGKEYNAME_MANUAL_PULL_QUEUE_URL);
    }

    if (queueUrl) {
      const client = new SQS({
        region: this.getConfigValue(CONFIGKEYNAME_AWS_REGION),
      });

      this._logger.debug(lc, `Trying to get a message from the queue...`);
      const messageOutput = await client.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });
      const messages = messageOutput.Messages;

      if (messages) {
        this._logger.debug(lc, `Received ${messages.length} messages`);
        for (const message of messages) {
          this._logger.debug(lc, `Got message: ${JSON.stringify(message)}`);
          const messageBody = message.Body;

          if (messageBody) {
            const messageBodyObj = JSON.parse(messageBody);

            this._logger.debug(lc, `Trying to get event from the message`);
            const event = JSON.parse(messageBodyObj.Message) as BaseEvent;
            this._logger.debug(
              lc,
              `Parsed event from record: ${event.eventType}`
            );
            return event;
          }
        }
      } else {
        this._logger.debug(lc, `Didn't receive any messages...`);
      }
    }
    return null;
  }

  async getNumEventsInQueue(queueName: string): Promise<number> {
    const lc = {
      principal: UnknownPrincipal,
      currentObj: this,
      methodName: 'getEventFromQueue',
    } as LogContext;

    let queueUrl = undefined;
    if (queueName === 'ManualPullQueue') {
      queueUrl = this.getConfigValue(CONFIGKEYNAME_MANUAL_PULL_QUEUE_URL);
    }

    if (queueUrl) {
      const client = new SQS({
        region: this.getConfigValue(CONFIGKEYNAME_AWS_REGION),
      });

      this._logger.debug(lc, `Trying to get attributes from the queue...`);
      const attributes = await client.getQueueAttributes({
        QueueUrl: queueUrl,
        AttributeNames: ['ApproximateNumberOfMessages'],
      });

      this._logger.debug(
        lc,
        `Received the following attributes: ${JSON.stringify(attributes)}`
      );

      this._logger.debug(
        lc,
        `Trying to parse the number of messages from the attributes...`
      );
      const numMessages =
        attributes.Attributes?.['ApproximateNumberOfMessages'];
      if (numMessages) {
        this._logger.debug(
          lc,
          `There are ~${numMessages} messages in the queue`
        );
        return Number(numMessages);
      } else {
        this._logger.debug(
          lc,
          `Couldn't parse the number of messages in the queue...`
        );
      }
    }

    return 0;
  }
}
