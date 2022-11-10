import {APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const service = container.resolveTodoService();

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const result = await service.getTodos();
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json',
    },
  };
};
