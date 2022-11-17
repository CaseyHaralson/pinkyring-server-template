import {Author} from '../dtos/blogPost';
import IBaseParams from '../interfaces/IBaseParams';
import IBlogRepository from '../interfaces/IBlogRepository';
import BaseService from './baseService';

export default class BlogService extends BaseService {
  private _blogRepository;
  constructor(bp: IBaseParams, blogRepository: IBlogRepository) {
    super(bp);
    this._blogRepository = blogRepository;
  }

  // add requestId, current user/principal

  async getBlogPosts({ids}: {ids?: string[]}) {
    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors({ids}: {ids?: string[]}) {
    return await this._blogRepository.getAuthors({ids});
  }

  addAuthor(requestId: string, author: Author) {
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
