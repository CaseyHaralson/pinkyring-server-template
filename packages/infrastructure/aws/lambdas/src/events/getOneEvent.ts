import {APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const eventHelper = container.resolveEventHelper();
const queueUrl = '';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  console.log(`Trying to get a message from the queue...`);
  const event = eventHelper.getEventFromQueue(queueUrl);

  if (event) {
    console.log(`Received event: ${JSON.stringify(event)}`);
  } else {
    console.log(`Didn't receive a message...`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(event),
    headers: {
      'content-type': 'application/json',
    },
  };
};
