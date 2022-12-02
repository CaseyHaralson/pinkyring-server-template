import {BaseEvent, EventType} from '@pinkyring/core/dtos/events';
import {BaseLogContext} from '@pinkyring/core/interfaces/ILog';
import {UnknownPrincipal} from '@pinkyring/core/interfaces/IPrincipal';
import container from '@pinkyring/di-container/container';
import {APIGatewayProxyResult} from 'aws-lambda';

const eventHelper = container.resolveEventHelper();

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const blc = {
    principal: UnknownPrincipal,
  } as BaseLogContext;

  const event = {
    eventType: EventType.BLOG_POST_ADDED,
    eventData: {
      data: 'data from the lambda',
    },
  } as BaseEvent;

  const result = await eventHelper.publishEvent(blc, event);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json',
    },
  };
};
