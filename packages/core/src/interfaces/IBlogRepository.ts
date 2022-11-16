import {Author, BlogPost} from '../dtos/blogPost';

export default interface IBlogRepository {
  getBlogPosts({ids}: {ids?: string[]}): Promise<BlogPost[]>;
  getAuthors({ids}: {ids?: string[]}): Promise<Author[]>;
  addAuthor(name: string): Promise<Author>;
  addBlogPost({
    authorId,
    title,
    text,
  }: {
    authorId: string;
    title: string;
    text: string;
  }): Promise<BlogPost>;
}
