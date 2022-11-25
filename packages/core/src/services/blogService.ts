import {Author, BlogPost} from '../dtos/blogPost';
import {BlogPostAddedEvent, EventType} from '../dtos/events';
import Principal from '../dtos/principal';
import IBaseParams from '../interfaces/IBaseParams';
import IBlogRepository from '../interfaces/IBlogRepository';
import {ILoggableClass, LogContext} from '../interfaces/ILog';
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
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'getBlogPosts',
    } as LogContext;
    this._logger.info(lc, 'entering the get blog posts function');

    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    const lc = {
      principal: principal,
      currentObj: this,
      methodName: 'getAuthors',
    } as LogContext;
    this._logger.info(lc, 'entering the get authors function');

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

    return this.idempotentRequest(
      principal,
      'addBlogPost',
      requestId,
      async () => {
        this._logger.info(lc, 'calling the repo to add the blog post');
        const result = await this._blogRepository.addBlogPost(blogPost);

        this._logger.info(lc, 'publishing the blog post added event');
        await this.publishEvent({
          eventType: EventType.BLOG_POST_ADDED,
          eventData: {
            authorId: result.authorId,
            blogPostId: result.id,
          },
        } as BlogPostAddedEvent);

        return result;
      }
    );
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
