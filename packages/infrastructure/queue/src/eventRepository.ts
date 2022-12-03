import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent, EVENT_BUS_NAME} from '@pinkyring/core/dtos/events';
import {connect, Connection} from 'amqplib';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';

const DURABLE = false;

const CONFIGKEYNAME_RABBITMQ_URL = 'RABBITMQ_URL';

export default class EventRepository
  extends BaseClass
  implements IEventRepository
{
  constructor(baseParams: IBaseParams) {
    super(baseParams, 'EventRepository', [
      {
        name: CONFIGKEYNAME_RABBITMQ_URL,
      },
    ]);
  }

  async publishEvent(event: BaseEvent): Promise<void> {
    this._logger.info(`Entering the publish event method`);
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    await channel.assertExchange(EVENT_BUS_NAME, 'topic', {
      durable: DURABLE,
    });
    channel.publish(
      EVENT_BUS_NAME,
      event.eventType,
      Buffer.from(JSON.stringify(event))
    );
    this.closeConnection(connection);
  }

  async createQueue(
    queueName: string,
    busName?: string,
    topicPattern?: string
  ) {
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: DURABLE});

    if (busName) {
      await channel.assertExchange(EVENT_BUS_NAME, 'topic', {
        durable: DURABLE,
      });

      if (topicPattern) {
        await channel.bindQueue(queueName, busName, topicPattern);
      }
    }

    this.closeConnection(connection);
  }

  async listenForEvents(
    queueName: string,
    handlerFunc: (event: BaseEvent) => Promise<boolean>
  ) {
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: DURABLE});
    channel.consume(
      queueName,
      async function (msg) {
        if (msg) {
          const content = msg.content.toString();
          const event = JSON.parse(content) as BaseEvent;
          const result = await handlerFunc(event);
          if (result) {
            channel.ack(msg);
          }
        }
      },
      {
        noAck: false,
      }
    );
  }

  async getEventFromQueue(queueName: string) {
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: DURABLE});
    const msg = await channel.get(queueName, {
      noAck: true,
    });

    if (msg) {
      const content = msg.content.toString();
      const event = JSON.parse(content) as BaseEvent;

      this.closeConnection(connection);
      return event;
    }

    this.closeConnection(connection);
    return null;
  }

  async getNumEventsInQueue(queueName: string) {
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    const queue = await channel.assertQueue(queueName, {durable: DURABLE});
    this.closeConnection(connection);
    return queue.messageCount;
  }

  private closeConnection(connection: Connection) {
    setTimeout(async function () {
      await connection.close();
    }, 500);
  }
}
