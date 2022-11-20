import {createSchema, createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
import {typeDefs, resolvers} from '@pinkyring/core/graphql/schema';
import {IContext} from '@pinkyring/core/graphql/IContext';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';
import {mapObjectsToKeys} from '@pinkyring/core/graphql/IDataLoader';
import {Author} from '@pinkyring/core/dtos/blogPost';

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  }),
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

const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
