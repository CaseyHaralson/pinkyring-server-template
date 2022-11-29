/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Author, BaseObject, BlogPost} from '../dtos/blogPost';
import Principal from '../dtos/principal';
import BlogService from '../services/blogService';
import {IDataLoader, IDataLoaderConstructable} from './IDataLoader';

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

export interface IContext {
  principal: Principal;
  blogService: BlogService;
  dataLoaderConstructable: IDataLoaderConstructable;
  authorDataLoader?: IDataLoader<string, Author>;
}

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

function mapObjectsToKeys<T extends BaseObject>(
  keys: readonly string[],
  objs: T[]
) {
  const map: {[key: string]: T} = {};
  objs.forEach((item) => [(map[item.id] = item)]);

  return keys.map((key) => map[key]);
}
