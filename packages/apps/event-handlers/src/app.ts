import {
  BaseEvent,
  BlogPostAddedEvent,
  EventType,
  EVENT_BUS_NAME,
} from '@pinkyring/core/dtos/events';
import Container from '@pinkyring/di-container/container';

const eventHelper = Container.resolveEventHelper();
const principal =
  Container.resolvePrincipalResolver().resolveMachinePrincipal('event handler');

const queueName = 'blogPostAddedQ';
eventHelper.createQueue(queueName, EVENT_BUS_NAME, EventType.BLOG_POST_ADDED);

function eventHandler(event: BaseEvent) {
  if (event.eventType === EventType.BLOG_POST_ADDED) {
    console.log(
      `In the event handler: received blog post added event: ${JSON.stringify(
        event
      )}`
    );
    const service = Container.resolveSubscriptionService();
    const eventData = (event as BlogPostAddedEvent).eventData;
    service.notifySubscribersOfNewBlogPost(
      principal,
      eventData.authorId,
      eventData.blogPostId
    );
  }
  return Promise.resolve(true);
}

eventHelper.listenForEvents(queueName, eventHandler);
