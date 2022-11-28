import {ApolloServer} from '@apollo/server';
import {startServerAndCreateLambdaHandler} from '@as-integrations/aws-lambda';
import {IContext, resolvers, typeDefs} from '@pinkyring/core/graphql/schema';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';

const server = new ApolloServer<IContext>({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(server, {
  context: async () => {
    // can resolve principal with header or something here
    const principal = container.resolvePrincipalResolver().resolve();

    return {
      principal: principal,
      blogService: container.resolveBlogService(),
      dataLoaderConstructable: DataLoader,
    } as IContext;
  },
});
