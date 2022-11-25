import {APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const eventHelper = container.resolveEventHelper();
const queueName = 'ManualPullQueue';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  console.log(`Trying to get the number of messages in the queue...`);
  await eventHelper.getNumEventsInQueue(queueName);

  console.log(`Trying to get a message from the queue...`);
  const event = await eventHelper.getEventFromQueue(queueName);

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
