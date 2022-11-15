import {Author, BlogPost} from '../dtos/blogPost';

export interface IBlogRepository {
  getBlogPosts({ids}: {ids?: string[]}): Promise<BlogPost[]>;
  getAuthors({ids}: {ids?: string[]}): Promise<Author[]>;
}
