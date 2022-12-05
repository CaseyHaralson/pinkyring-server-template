import {Author, BaseDTO, BlogPost} from '../dtos/blogPost';

export default interface IBlogRepository {
  getBlogPosts({ids}: {ids?: string[]}): Promise<BlogPost[]>;
  getAuthors({ids}: {ids?: string[]}): Promise<Author[]>;
  addAuthor(author: Author): Promise<Author>;
  addBlogPost(blogPost: BlogPost): Promise<BlogPost>;
  updateBlogPost(blogPost: BlogPost): Promise<BlogPost>;
}

export interface IValidateData<T extends BaseDTO> {
  validate(data: T): void;
}

// validate base object data (int, date, string length, etc)
// can add other things here too like
// is the start date on the first of the month
// is the end date on the last day of the month

// can this principal make this change?

// validate action business rules
// is it the first of the month, can't make changes
// can this employee have this plan?
//

// database rules (unique, etc)
// how do you ask for certain rules here?
// like, duplicate plans can't exist?
// business rule?
//
