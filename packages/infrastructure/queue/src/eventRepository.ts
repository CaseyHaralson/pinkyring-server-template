import IEventRepository from '@pinkyring/core/interfaces/IEventRepository';
import {BaseEvent, EVENT_BUS_NAME} from '@pinkyring/core/dtos/events';
import {connect, Connection} from 'amqplib';

const DURABLE = false;

export default class EventRepository implements IEventRepository {
  async publishEvent(event: BaseEvent): Promise<void> {
    const connection = await connect('amqp://localhost');
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
    const connection = await connect('amqp://localhost');
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
    const connection = await connect('amqp://localhost');
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
    const connection = await connect('amqp://localhost');
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

  private closeConnection(connection: Connection) {
    setTimeout(async function () {
      await connection.close();
    }, 500);
  }
}
