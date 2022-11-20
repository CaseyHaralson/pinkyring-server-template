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
    this._logger.info(
      {
        principal: principal,
        currentObj: this,
        methodName: 'getBlogPosts',
      },
      'entering the get blog posts function'
    );

    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    this._logger.info(
      {
        principal: principal,
        currentObj: this,
        methodName: 'getAuthors',
      },
      'entering the get authors function'
    );

    return await this._blogRepository.getAuthors({ids});
  }

  addAuthor(principal: Principal, requestId: string, author: Author) {
    this._logger.info(
      {
        principal: principal,
        currentObj: this,
        methodName: 'addAuthor',
        requestId: requestId,
      },
      'entering the add author function'
    );

    return this.idempotentRequest(principal, 'addAuthor', requestId, () => {
      return this._blogRepository.addAuthor(author);
    });
  }

  async addBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    this._logger.info(
      {
        principal: principal,
        currentObj: this,
        methodName: 'addBlogPost',
        requestId: requestId,
      },
      'entering the add blog post function'
    );

    return this.idempotentRequest(principal, 'addBlogPost', requestId, () => {
      return this._blogRepository.addBlogPost(blogPost);
    });
  }

  async updateBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    this._logger.info(
      {
        principal: principal,
        currentObj: this,
        methodName: 'updateBlogPost',
        requestId: requestId,
      },
      'entering the update blog post function'
    );

    return this.idempotentRequest(
      principal,
      'updateBlogPost',
      requestId,
      () => {
        return this._blogRepository.updateBlogPost(blogPost);
      }
    );
  }
}
