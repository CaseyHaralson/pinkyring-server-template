import {
  BaseEvent,
  EventType,
  EVENT_BUS_NAME,
} from '@pinkyring/core/dtos/events';
import Container from '@pinkyring/di-container/container';

const eventHelper = Container.resolveEventHelper();

eventHelper.createQueue(
  'blogPostAddedQ',
  EVENT_BUS_NAME,
  EventType.BLOG_POST_ADDED
);

function eventHandler(event: BaseEvent) {
  if (event.eventType === EventType.BLOG_POST_ADDED) {
    console.log(`Received blog post added event: ${JSON.stringify(event)}`);
  }
  return Promise.resolve(true);
}

eventHelper.listenForMessages('blogPostAddedQ', eventHandler);
