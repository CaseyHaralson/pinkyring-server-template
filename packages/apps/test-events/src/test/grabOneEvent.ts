import {EventType, EVENT_BUS_NAME} from '@pinkyring/core/dtos/events';
import Container from '@pinkyring/di-container/container';

const eventHelper = Container.resolveEventHelper();

const queueName = 'testEventListenerQ';
console.log(`Creating queue: ${queueName}`);
eventHelper.createQueue(queueName, EVENT_BUS_NAME, EventType.TEST_EVENT);

console.log(`Trying to get a message from the queue...`);
eventHelper.getEventFromQueue(queueName).then(async function (event) {
  if (event) {
    console.log(`Received event: ${JSON.stringify(event)}`);
  } else {
    console.log(`Didn't receive a message...`);
  }
});
