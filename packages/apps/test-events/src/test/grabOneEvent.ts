import {EventType, EVENT_BUS_NAME} from '@pinkyring/core/dtos/events';
import Container from '@pinkyring/di-container/container';

const eventHelper = Container.resolveEventHelper();

const queueName = 'testEventListenerQ';
console.log(`Creating queue if it doesn't exist: ${queueName}`);
eventHelper.createQueue(queueName, EVENT_BUS_NAME, EventType.TEST_EVENT);

eventHelper.getNumEventsInQueue(queueName).then(function (count) {
  console.log(`Number of messages in the queue: ${count}`);
});

console.log(`Trying to get a message from the queue...`);
eventHelper.getEventFromQueue(queueName).then(async function (event) {
  if (event) {
    console.log(`Received event: ${JSON.stringify(event)}`);
  } else {
    console.log(`Didn't receive a message...`);
  }
});
