import {Author, BlogPost} from '../dtos/blogPost';
import {BlogPostAddedEvent, EventType} from '../dtos/events';
import Principal from '../dtos/principal';
import IBlogRepository from '../interfaces/IBlogRepository';
import {LogContext} from '../interfaces/ILog';
import BaseService, {IBaseServiceParams} from './baseService';

export default class BlogService extends BaseService {
  private _blogRepository;
  constructor(
    baseServiceParams: IBaseServiceParams,
    blogRepository: IBlogRepository
  ) {
    super(baseServiceParams, 'BlogService');
    this._blogRepository = blogRepository;
  }

  async getBlogPosts(principal: Principal, {ids}: {ids?: string[]}) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'getBlogPosts',
    } as LogContext;
    this._logger.info(lc, 'entering the get blog posts function');

    // can use principal to authorize request

    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'getAuthors',
    } as LogContext;
    this._logger.info(lc, 'entering the get authors function');

    // can use principal to authorize request

    return await this._blogRepository.getAuthors({ids});
  }

  addAuthor(principal: Principal, requestId: string, author: Author) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'addAuthor',
      requestId: requestId,
    } as LogContext;
    this._logger.info(lc, 'entering the add author function');

    // can use principal to authorize request

    return this.idempotentRequest(principal, 'addAuthor', requestId, () => {
      this._logger.info(lc, 'calling the repo to add the author');
      return this._blogRepository.addAuthor(author);
    });
  }

  async addBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'addBlogPost',
      requestId: requestId,
    } as LogContext;
    this._logger.info(lc, 'entering the add blog post function');

    // can use principal to authorize request

    let blogPostAdded = false;
    const requestResult = await this.idempotentRequest(
      principal,
      'addBlogPost',
      requestId,
      async () => {
        this._logger.info(lc, 'calling the repo to add the blog post');
        const result = await this._blogRepository.addBlogPost(blogPost);
        blogPostAdded = result != undefined;
        return result;
      }
    );

    if (blogPostAdded) {
      this._logger.info(lc, 'publishing the blog post added event');
      await this.publishEvent(lc, {
        eventType: EventType.BLOG_POST_ADDED,
        eventData: {
          authorId: requestResult.authorId,
          blogPostId: requestResult.id,
        },
      } as BlogPostAddedEvent);
    }

    return requestResult;
  }

  async updateBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'updateBlogPost',
      requestId: requestId,
    } as LogContext;
    this._logger.info(lc, 'entering the update blog post function');

    // can use principal to authorize request

    return this.idempotentRequest(
      principal,
      'updateBlogPost',
      requestId,
      () => {
        this._logger.info(lc, 'calling the repo to update the author');
        return this._blogRepository.updateBlogPost(blogPost);
      }
    );
  }
}
