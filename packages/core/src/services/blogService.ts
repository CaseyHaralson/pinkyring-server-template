import {Author, BlogPost} from '../dtos/blogPost';
import {BlogPostAddedEvent, EventType} from '../dtos/events';
import Principal from '../interfaces/IPrincipal';
import IBlogRepository from '../interfaces/IBlogRepository';
import BaseService, {IBaseServiceParams} from './baseService';

/** Exposes blog functions for the project. */
export default class BlogService extends BaseService {
  private _blogRepository;
  constructor(
    baseServiceParams: IBaseServiceParams,
    blogRepository: IBlogRepository
  ) {
    super(baseServiceParams, 'BlogService');
    this._blogRepository = blogRepository;
  }

  /**
   * Gets blog posts based on the filters.
   * @param principal the current security principal
   * @param param1
   * @returns a list of blog posts that match the filters
   */
  async getBlogPosts(principal: Principal, {ids}: {ids?: string[]}) {
    return await this.session(principal, async () => {
      this._logger.info('entering the get blog posts function');

      // can use principal to authorize request

      return await this._blogRepository.getBlogPosts({ids});
    });
  }

  /**
   * Gets blog authors based on the filters.
   * @param principal the current security principal
   * @param param1
   * @returns a list of authors that match the filters
   */
  async getAuthors(principal: Principal, {ids}: {ids?: string[]}) {
    return await this.session(principal, async () => {
      this._logger.info('entering the get authors function');

      // can use principal to authorize request

      return await this._blogRepository.getAuthors({ids});
    });
  }

  /**
   * Add an author.
   * @param principal the current security principal
   * @param requestId an id to make sure the request is handled idempotently
   * @param author the author data
   * @returns the author
   */
  async addAuthor(principal: Principal, requestId: string, author: Author) {
    return await this.session(principal, async () => {
      this._logger.info('entering the add author function');

      // can use principal to authorize request

      // validate the author name is unique
      // validate<Author>(author, create)

      return this.idempotentRequest(principal, 'addAuthor', requestId, () => {
        this._logger.info('calling the repo to add the author');
        return this._blogRepository.addAuthor(author);
      });
    });
  }

  /**
   * Add a blog post. Also publishes the event if any other services are interested.
   * @param principal the current security principal
   * @param requestId an id to make sure the request is handled idempotently
   * @param blogPost the blog post data
   * @returns the blog post
   */
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

  /**
   * Updates a blog post.
   * @param principal the current security principal
   * @param requestId an id to make sure the request is handled idempotently
   * @param blogPost the updated blog post data
   * @returns the blog post
   */
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
