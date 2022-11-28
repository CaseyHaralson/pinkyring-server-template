import {ApolloServer} from '@apollo/server';
import {startServerAndCreateLambdaHandler} from '@as-integrations/aws-lambda';
import {
  authorDataLoaderHandler,
  resolvers,
  typeDefs,
} from '@pinkyring/core/graphql/schema';
import {IContext} from '@pinkyring/core/graphql/IContext';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';
import {Author} from '@pinkyring/core/dtos/blogPost';

const server = new ApolloServer<IContext>({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(server, {
  context: async () => {
    // can resolve principal with header or something here
    const principal = container.resolvePrincipalResolver().resolve();

    const blogService = container.resolveBlogService();

    return {
      principal: principal,
      blogService: blogService,
      authorDataLoader: new DataLoader<string, Author>(async (keys) => {
        return await authorDataLoaderHandler(keys, blogService, principal);
      }),
    } as IContext;
  },
});
