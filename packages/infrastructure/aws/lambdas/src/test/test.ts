import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import container from '@pinkyring/di-container/container';

const service = container.resolveTestService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  // return {
  //   statusCode: 200,
  //   body: `Queries: ${queries}`,
  // };

  const result = service.test(queries);
  return {
    statusCode: 200,
    body: result,
  };
};
