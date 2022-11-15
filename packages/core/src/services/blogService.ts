import {IBlogRepository} from '../interfaces/IBlogRepository';

export default class BlogService {
  private _blogRepository;
  constructor(blogRepository: IBlogRepository) {
    this._blogRepository = blogRepository;
  }

  // add requestId, current user/principal

  async getBlogPosts({ids}: {ids?: string[]}) {
    return await this._blogRepository.getBlogPosts({ids});
  }

  async getAuthors({ids}: {ids?: string[]}) {
    return await this._blogRepository.getAuthors({ids});
  }
}
