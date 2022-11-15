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
    authors(ids: [String]!): [Author]
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
};
