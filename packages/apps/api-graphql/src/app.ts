import {createSchema, createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
//import {resolvers, typeDefs} from '@pinkyring/infrastructure_graphql/schema';
import {typeDefs, resolvers} from '@pinkyring/core/graphql/schema';
import {IContext} from '@pinkyring/core/graphql/IContext';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';
import {IDataLoader} from '@pinkyring/core/graphql/IDataLoader';
import {Author, BaseObject} from '@pinkyring/core/dtos/blogPost';

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  }),
  context: async () => {
    return {
      blogService: container.resolveBlogService(),
      authorLoader: new DataLoader<string, Author>(async (keys) => {
        const authors = await container
          .resolveBlogService()
          .getAuthors({ids: keys as string[]});

        return mapObjectsToKeys(keys, authors);
      }) as IDataLoader<Author>,
    } as IContext;
  },
});

function mapObjectsToKeys<T extends BaseObject>(
  keys: readonly string[],
  objs: T[]
) {
  const map: {[key: string]: T} = {};
  objs.forEach((item) => [(map[item.id] = item)]);

  return keys.map((key) => map[key]);
}

const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
