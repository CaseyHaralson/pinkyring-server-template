/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Author, BlogPost} from '../dtos/blogPost';
import {IContext} from './IContext';

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
      authorId: String, 
      title: String,
      text: String
    ): BlogPost
  }
`;

export const resolvers = {
  Query: {
    blogPosts(_: any, args: any, context: IContext, info: any) {
      return context.blogService.getBlogPosts(args);
    },
    authors(_: any, args: any, context: IContext, info: any) {
      return context.blogService.getAuthors(args);
    },
  },
  BlogPost: {
    author(obj: BlogPost, args: any, context: IContext, info: any) {
      return context.authorLoader.load(obj.authorId);
    },
  },
  Mutation: {
    addAuthor(_: any, args: any, context: IContext, info: any) {
      return context.blogService.addAuthor(args.requestId, args);
    },
    async addBlogPost(_: any, args: any, context: IContext, info: any) {
      return await context.blogService.addBlogPost(args);
    },
  },
};
