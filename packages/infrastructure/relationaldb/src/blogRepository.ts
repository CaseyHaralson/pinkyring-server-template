import IBlogRepository from '@pinkyring/core/interfaces/IBlogRepository';
import {BlogPost, Author} from '@pinkyring/core/dtos/blogPost';
import {PrismaClient} from '@prisma/client';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/index';
import {DataValidationError} from '@pinkyring/core/interfaces/IDataValidator';
import {ERROR_CODE} from './util/prismaErrorCodes';

export default class BlogRepository
  extends BaseClass
  implements IBlogRepository
{
  private _prismaClient;
  constructor(baseParams: IBaseParams, prismaClient: PrismaClient) {
    super(baseParams, 'BlogRepository');
    this._prismaClient = prismaClient;
  }
  async getBlogPosts({ids}: {ids?: string[] | undefined}): Promise<BlogPost[]> {
    const blogPosts =
      ids === undefined
        ? await this._prismaClient.blogPost.findMany()
        : await this._prismaClient.blogPost.findMany({
            where: {
              id: {in: ids},
            },
          });
    return blogPosts as unknown as BlogPost[];
  }

  async getAuthors({ids}: {ids?: string[] | undefined}): Promise<Author[]> {
    const authors =
      ids === undefined
        ? await this._prismaClient.author.findMany()
        : await this._prismaClient.author.findMany({
            where: {
              id: {in: ids},
            },
          });
    return authors as unknown as Author[];
  }

  async addAuthor(author: Author): Promise<Author> {
    try {
      const dbAuthor = await this._prismaClient.author.create({
        data: {
          name: author.name,
        },
      });
      return dbAuthor;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === ERROR_CODE.UNIQUE_CONSTRAINT)
          uniqueConstraintError(e.meta?.target as string);
      }
      throw e;
    }
  }

  async addBlogPost(blogPost: BlogPost) {
    try {
      const dbBlogPost = await this._prismaClient.blogPost.create({
        data: {
          authorId: blogPost.authorId,
          title: blogPost.title,
          text: blogPost.text,
        },
      });
      return dbBlogPost;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === ERROR_CODE.UNIQUE_CONSTRAINT)
          uniqueConstraintError(e.meta?.target as string);
      }
      throw e;
    }
  }

  async updateBlogPost(blogPost: BlogPost) {
    try {
      const dbBlogPost = await this._prismaClient.blogPost.update({
        where: {
          id: blogPost.id,
        },
        data: {
          title: blogPost.title != null ? blogPost.title : undefined,
          text: blogPost.text != null ? blogPost.text : undefined,
        },
      });
      return dbBlogPost;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === ERROR_CODE.UNIQUE_CONSTRAINT)
          uniqueConstraintError(e.meta?.target as string);
      }
      throw e;
    }
  }
}

function uniqueConstraintError(target: string) {
  if (target === 'Author_name_key') {
    throw new DataValidationError([`the author name must be unique`]);
  }
  if (target === 'BlogPost_authorId_title_key') {
    throw new DataValidationError([
      `the blog post title must be unique per author`,
    ]);
  }
}
