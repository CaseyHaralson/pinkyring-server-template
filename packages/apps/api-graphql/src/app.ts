import {createSchema, createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
import {typeDefs, resolvers, IContext} from '@pinkyring/core/graphql/schema';
import container from '@pinkyring/di-container/container';
import DataLoader from 'dataloader';

// ======================================
// Get configurations
const CONFIGKEYNAME_APPS_GRAPHQL_PORT = 'APPS_GRAPHQL_PORT';
const configHelper = container.resolveConfigHelper();
configHelper.registerNeededConfigurations([
  {
    name: CONFIGKEYNAME_APPS_GRAPHQL_PORT,
  },
]);
const configPort = Number(
  configHelper.getConfigValue(CONFIGKEYNAME_APPS_GRAPHQL_PORT)
);
const port = configPort != 0 ? configPort : 4000;
// ======================================

// create yoga graphql server
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
      dataLoaderConstructable: DataLoader,
    } as IContext;
  },
});

const server = createServer(yoga);

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`);
});
