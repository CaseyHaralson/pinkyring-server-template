import {Author, BlogPost} from '../dtos/blogPost';

export default interface IBlogRepository {
  getBlogPosts({ids}: {ids?: string[]}): Promise<BlogPost[]>;
  getAuthors({ids}: {ids?: string[]}): Promise<Author[]>;
}
