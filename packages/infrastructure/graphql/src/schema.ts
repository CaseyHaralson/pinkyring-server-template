import container from '@pinkyring/di-container/container';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';

export const typeDefs = `
  type Todo {
    id: String
    text: String
  }

  type Query {
    todos: [Todo]
  }
`;

export const resolvers = {
  Query: {
    todos() {
      const service = container.resolveTodoService();
      return service.getTodos();
    },
  },
};

// export const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// });

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
});
