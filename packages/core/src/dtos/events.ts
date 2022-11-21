export interface BaseEvent {
  eventType: EventType;
  eventData: unknown;
}

export interface BlogPostAddedEvent extends BaseEvent {
  eventType: EventType.BLOG_POST_ADDED;
  eventData: {
    authorId: string;
    blogPostId: string;
  };
}

export enum EventType {
  BLOG_POST_ADDED = 1,
}

export const EVENT_BUS_NAME = 'PINKYRING';
