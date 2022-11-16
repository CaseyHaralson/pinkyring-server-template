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
    addAuthor(name: String!): Author
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
      const serivce = context.blogService;
      const blogPosts = serivce.getBlogPosts(args);
      return blogPosts;
    },
    authors(_: any, args: any, context: IContext, info: any) {
      const serivce = context.blogService;
      const authors = serivce.getAuthors(args);
      return authors;
    },
  },
  BlogPost: {
    author(obj: BlogPost, args: any, context: IContext, info: any) {
      const dataLoader = context.authorLoader;
      const author = dataLoader.load(obj.authorId);
      return author;
    },
  },
  Mutation: {
    async addAuthor(_: any, args: any, context: IContext, info: any) {
      const serivce = context.blogService;
      const author = await serivce.addAuthor(args.name);
      return author;
    },
    async addBlogPost(_: any, args: any, context: IContext, info: any) {
      return await context.blogService.addBlogPost(args);
    },
  },
};
