import IBlogRepository from '@pinkyring/core/interfaces/IBlogRepository';
import {BlogPost, Author} from '@pinkyring/core/dtos/blogPost';
import {PrismaClient} from '@prisma/client';

export default class BlogRepository implements IBlogRepository {
  private _prismaClient;
  constructor(prismaClient: PrismaClient) {
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
}
