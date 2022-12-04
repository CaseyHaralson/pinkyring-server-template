export const EVENT_BUS_NAME = 'PINKYRING';

export enum EventType {
  TEST_EVENT = 'test.event',
  BLOG_POST_ADDED = 'blogpost.added',
}

/** An event object that can be placed on an event bus */
export interface BaseEvent {
  eventType: EventType;
  eventData: unknown;
}

export interface BlogPostAddedEvent extends BaseEvent {
  eventData: {
    authorId: string;
    blogPostId: string;
  };
}
