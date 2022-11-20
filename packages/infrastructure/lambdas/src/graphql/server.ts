import {ApolloServer} from '@apollo/server';
import {startServerAndCreateLambdaHandler} from '@as-integrations/aws-lambda';
import {resolvers, typeDefs} from '@pinkyring/core/graphql/schema';
import {IContext} from '@pinkyring/core/graphql/IContext';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';
import {Author} from '@pinkyring/core/dtos/blogPost';
import {mapObjectsToKeys} from '@pinkyring/core/graphql/IDataLoader';

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
      authorLoader: new DataLoader<string, Author>(async (keys) => {
        const authors = await container
          .resolveBlogService()
          .getAuthors(principal, {ids: keys as string[]});

        return mapObjectsToKeys(keys, authors);
      }),
    } as IContext;
  },
});
