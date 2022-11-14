import {ApolloServer} from '@apollo/server';
import {startServerAndCreateLambdaHandler} from '@as-integrations/aws-lambda';
import {resolvers, typeDefs} from '@pinkyring/infrastructure_graphql/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(server);
