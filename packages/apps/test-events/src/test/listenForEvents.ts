import {
  BaseEvent,
  EventType,
  EVENT_BUS_NAME,
} from '@pinkyring/core/dtos/events';
import Container from '@pinkyring/di-container/container';

const eventHelper = Container.resolveEventHelper();

const queueName = 'testEventListenerQ';
console.log(`Creating queue: ${queueName}`);
eventHelper.createQueue(queueName, EVENT_BUS_NAME, EventType.TEST_EVENT);

function eventHandler(event: BaseEvent) {
  if (event.eventType === EventType.TEST_EVENT) {
    console.log(`Received test event: ${JSON.stringify(event)}`);
  }
  return Promise.resolve(true);
}

console.log(`Listening for messages on queue...`);
eventHelper.listenForEvents(queueName, eventHandler);
