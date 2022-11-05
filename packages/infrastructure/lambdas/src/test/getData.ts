import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const service = container.resolveTestService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const result = service.getData();
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json',
    },
  };
};
