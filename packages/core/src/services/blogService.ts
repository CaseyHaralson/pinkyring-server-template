import {Author, BlogPost} from '../dtos/blogPost';
import {BlogPostAddedEvent, EventType} from '../dtos/events';
import Principal from '../interfaces/IPrincipal';
import IBlogRepository from '../interfaces/IBlogRepository';
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
    return await this.session(principal, async () => {
      this._logger.info('entering the get blog posts function');

      // can use principal to authorize request

      return await this._blogRepository.getBlogPosts({ids});
    });
  }

  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    return await this.session(principal, async () => {
      this._logger.info('entering the get authors function');

      // can use principal to authorize request

      return await this._blogRepository.getAuthors({ids});
    });
  }

  async addAuthor(principal: Principal, requestId: string, author: Author) {
    return await this.session(principal, async () => {
      this._logger.info('entering the add author function');

      // can use principal to authorize request

      return this.idempotentRequest(principal, 'addAuthor', requestId, () => {
        this._logger.info('calling the repo to add the author');
        return this._blogRepository.addAuthor(author);
      });
    });
  }

  async addBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    return await this.session(principal, async () => {
      this._logger.info('entering the add blog post function');

      // can use principal to authorize request

      let blogPostAdded = false;
      const requestResult = await this.idempotentRequest(
        principal,
        'addBlogPost',
        requestId,
        async () => {
          this._logger.info('calling the repo to add the blog post');
          const result = await this._blogRepository.addBlogPost(blogPost);
          blogPostAdded = result != undefined;
          return result;
        }
      );

      if (blogPostAdded) {
        this._logger.info('publishing the blog post added event');
        await this.publishEvent({
          eventType: EventType.BLOG_POST_ADDED,
          eventData: {
            authorId: requestResult.authorId,
            blogPostId: requestResult.id,
          },
        } as BlogPostAddedEvent);
      }

      return requestResult;
    });
  }

  async updateBlogPost(
    principal: Principal,
    requestId: string,
    blogPost: BlogPost
  ) {
    return await this.session(principal, async () => {
      this._logger.info('entering the update blog post function');

      // can use principal to authorize request

      return this.idempotentRequest(
        principal,
        'updateBlogPost',
        requestId,
        () => {
          this._logger.info('calling the repo to update the author');
          return this._blogRepository.updateBlogPost(blogPost);
        }
      );
    });
  }
}
