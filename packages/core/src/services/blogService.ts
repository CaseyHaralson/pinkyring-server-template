import IBlogRepository from '../interfaces/IBlogRepository';

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

  async addAuthor(name: string) {
    return await this._blogRepository.addAuthor(name);
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
