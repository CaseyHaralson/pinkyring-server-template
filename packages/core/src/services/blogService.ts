import {Author, BlogPost} from '../dtos/blogPost';
import Principal from '../dtos/principal';
import IBaseParams from '../interfaces/IBaseParams';
import IBlogRepository from '../interfaces/IBlogRepository';
import {ILoggableClass} from '../interfaces/ILog';
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

  async getBlogPosts(principal: Principal, {ids}: {ids?: string[]}) {
    this._logger.info(this, 'get blog posts function');
    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    this._logger.info(this, 'get authors function');
    return await this._blogRepository.getAuthors({ids});
  }

  addAuthor(principal: Principal, requestId: string, author: Author) {
    this._logger.info(this, 'add author function');
    const specificRequestId = this.specifyRequestId(
      principal,
      'addAuthor',
      requestId
    );
    return this.idempotentRequest(specificRequestId, () => {
      return this._blogRepository.addAuthor(author);
    });
  }

  async addBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    this._logger.info(this, 'add blog post function');
    const specificRequestId = this.specifyRequestId(
      principal,
      'addBlogPost',
      requestId
    );
    return this.idempotentRequest(specificRequestId, () => {
      return this._blogRepository.addBlogPost(blogPost);
    });
  }

  async updateBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    this._logger.info(this, 'update blog post function');
    const specificRequestId = this.specifyRequestId(
      principal,
      'updateBlogPost',
      requestId
    );
    return this.idempotentRequest(specificRequestId, () => {
      return this._blogRepository.updateBlogPost(blogPost);
    });
  }
}
