import {APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const service = container.resolveTodoService();

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const todo = {
    text: 'test creating todo from inside lambda',
    completed: false,
  };
  const result = await service.createTodo(todo);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json',
    },
  };
};
