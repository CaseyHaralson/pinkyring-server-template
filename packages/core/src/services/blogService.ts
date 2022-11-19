import {Author, BlogPost} from '../dtos/blogPost';
import IBaseParams from '../interfaces/IBaseParams';
import IBlogRepository from '../interfaces/IBlogRepository';
import {ILoggableClass} from '../interfaces/ILogger';
import BaseService from './baseService';

export default class BlogService extends BaseService implements ILoggableClass {
  private _blogRepository;
  constructor(baseParams: IBaseParams, blogRepository: IBlogRepository) {
    super(baseParams);
    this._blogRepository = blogRepository;
  }

  _className(): string {
    return 'BlogService';
  }

  // add current user/principal

  async getBlogPosts({ids}: {ids?: string[]}) {
    this._logger.info(this, 'get blog posts function');
    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors({ids}: {ids?: string[]}) {
    this._logger.info(this, 'get authors function');
    return await this._blogRepository.getAuthors({ids});
  }

  addAuthor(requestId: string, author: Author) {
    this._logger.info(this, 'add author function');
    return this.idempotentRequest(requestId, () => {
      return this._blogRepository.addAuthor(author);
    });
  }

  async addBlogPost(requestId: string, blogPost: BlogPost) {
    this._logger.info(this, 'add blog post function');
    return this.idempotentRequest(requestId, () => {
      return this._blogRepository.addBlogPost(blogPost);
    });
  }

  async updateBlogPost(requestId: string, blogPost: BlogPost) {
    this._logger.info(this, 'update blog post function');
    return this.idempotentRequest(requestId, () => {
      return this._blogRepository.updateBlogPost(blogPost);
    });
  }
}
