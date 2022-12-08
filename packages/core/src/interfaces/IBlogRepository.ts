import {Author, BlogPost} from '../dtos/blogPost';

export default interface IBlogRepository {
  getBlogPosts({ids}: {ids?: string[]}): Promise<BlogPost[]>;
  getAuthors({ids}: {ids?: string[]}): Promise<Author[]>;
  addAuthor(author: Author): Promise<Author>;
  addBlogPost(blogPost: BlogPost): Promise<BlogPost>;
  updateBlogPost(blogPost: BlogPost): Promise<BlogPost>;
}
