import {Author} from '../dtos/blogPost';
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

  // add requestId, current user/principal

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
      return this._blogRepository.addAuthor(author.name);
    });
  }

  async addBlogPost({
    authorId,
    title,
    text,
  }: {
    authorId: string;
    title: string;
    text: string;
  }) {
    return await this._blogRepository.addBlogPost({authorId, title, text});
  }
}
