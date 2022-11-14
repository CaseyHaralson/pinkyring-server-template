/* eslint-disable @typescript-eslint/no-explicit-any */
import container from '@pinkyring/di-container/container';
//import {makeExecutableSchema} from '@graphql-tools/schema';
//import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';

export const typeDefs = `#graphql
  type Todo {
    id: String
    text: String
  }

  type Query {
    todos(searchText: String): [Todo]
  }
`;

export const resolvers = {
  Query: {
    todos(_: any, {searchText}: {searchText: string}) {
      const service = container.resolveTodoService();
      return service.getTodos(searchText);
    },
  },
};

// export const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// });

// export const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: () => 'world',
//       },
//     },
//   }),
// });
