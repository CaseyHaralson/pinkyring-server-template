/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Author, BaseDTO, BlogPost} from '../dtos/blogPost';
import Principal from '../interfaces/IPrincipal';
import BlogService from '../services/blogService';
import {IDataLoader, IDataLoaderConstructable} from './IDataLoader';

/** The project graphql type definitions */
export const typeDefs = `#graphql
  type BlogPost {
    id: String
    title: String
    text: String

    author: Author
  }

  type Author {
    id: String
    name: String
  }

  type Query {
    blogPosts: [BlogPost]
    authors: [Author]
  }

  type Mutation {
    addAuthor(requestId: String!, name: String!): Author
    addBlogPost(
      requestId: String!,
      authorId: String!, 
      title: String!,
      text: String!
    ): BlogPost
    updateBlogPost(
      requestId: String!,
      id: String!,
      title: String,
      text: String
    ): BlogPost
  }
`;

/** Context object that should be loaded and injected into the resolver functions. */
export interface IContext {
  principal: Principal;
  blogService: BlogService;
  dataLoaderConstructable: IDataLoaderConstructable;
  authorDataLoader?: IDataLoader<string, Author>;
}

/** The project graphql data resolvers */
export const resolvers = {
  Query: {
    blogPosts(_: any, args: any, context: IContext, info: any) {
      return context.blogService.getBlogPosts(context.principal, args);
    },
    authors(_: any, args: any, context: IContext, info: any) {
      return context.blogService.getAuthors(context.principal, args);
    },
  },
  BlogPost: {
    author(obj: BlogPost, args: any, context: IContext, info: any) {
      createDataLoaders(context);
      return context.authorDataLoader?.load(obj.authorId);
    },
  },
  Mutation: {
    addAuthor(_: any, args: any, context: IContext, info: any) {
      return context.blogService.addAuthor(
        context.principal,
        args.requestId,
        args
      );
    },
    async addBlogPost(_: any, args: any, context: IContext, info: any) {
      return await context.blogService.addBlogPost(
        context.principal,
        args.requestId,
        args
      );
    },
    async updateBlogPost(_: any, args: any, context: IContext, info: any) {
      return await context.blogService.updateBlogPost(
        context.principal,
        args.requestId,
        args
      );
    },
  },
};

/** Make sure the data loaders in the context are created before they are used */
function createDataLoaders(context: IContext) {
  if (context.authorDataLoader === undefined) {
    context.authorDataLoader = new context.dataLoaderConstructable<
      string,
      Author
    >(async (keys) => {
      const authors = await context.blogService.getAuthors(context.principal, {
        ids: keys as string[],
      });

      return mapObjectsToKeys(keys, authors);
    });
  }
}

/** Helper function to map data-loaded objects back to their source request keys */
function mapObjectsToKeys<T extends BaseDTO>(
  keys: readonly string[],
  objs: T[]
) {
  const map: {[key: string]: T} = {};
  objs.forEach((item) => {
    map[item.id] = item;
  });

  return keys.map((key) => map[key]);
}
