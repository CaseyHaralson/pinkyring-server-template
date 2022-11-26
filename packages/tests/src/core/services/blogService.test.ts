import BlogService from '@pinkyring/core/services/blogService';
import IBlogRepository from '@pinkyring/core/interfaces/IBlogRepository';
import {mock, mockReset} from 'jest-mock-extended';
import IdempotentRequestHelper from '@pinkyring/core/util/idempotentRequestHelper';
import IIdempotentRequestRepository from '@pinkyring/core/interfaces/IIdempotentRequestRepository';
import Logger from '@pinkyring/core/util/logger';
import Principal from '@pinkyring/core/dtos/principal';
import EventHelper from '@pinkyring/core/util/eventHelper';
import {IBaseServiceParams} from '@pinkyring/core/services/baseService';

describe('blog service unit tests', () => {
  const baseParams = mock<IBaseServiceParams>();
  baseParams.logger = mock<Logger>();
  const idempotentRequestHelper = new IdempotentRequestHelper(
    mock<IIdempotentRequestRepository>(),
    mock<Logger>()
  );
  baseParams.idempotentRequestHelper = idempotentRequestHelper;
  baseParams.eventHelper = mock<EventHelper>();
  const blogRepoMock = mock<IBlogRepository>();
  const blogService = new BlogService(baseParams, blogRepoMock);
  const principal = mock<Principal>();

  beforeEach(() => {
    mockReset(baseParams.logger);
    idempotentRequestHelper.handleIdempotentRequest = jest.fn(
      (
        _: Principal,
        __: string,
        ___: string,
        ____: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestFunc: any
      ) => {
        return requestFunc();
      }
    );
    mockReset(baseParams.eventHelper);
    mockReset(blogRepoMock);
  });

  describe('get blog posts function', () => {
    test('should call repository', async () => {
      await blogService.getBlogPosts(principal, {});

      expect(blogRepoMock.getBlogPosts).toBeCalledTimes(1);
    });

    test('should call repository with ids', async () => {
      const ids = ['1', '2', '3', '4'];
      await blogService.getBlogPosts(principal, {ids: ids});

      expect(blogRepoMock.getBlogPosts).toBeCalledTimes(1);
      expect(blogRepoMock.getBlogPosts).toBeCalledWith({ids: ids});
    });
  });

  describe('get authors function', () => {
    test('should call repository', async () => {
      await blogService.getAuthors(principal, {});

      expect(blogRepoMock.getAuthors).toBeCalledTimes(1);
    });

    test('should call repository with ids', async () => {
      const ids = ['1', '2', '3', '4'];
      await blogService.getAuthors(principal, {ids: ids});

      expect(blogRepoMock.getAuthors).toBeCalledTimes(1);
      expect(blogRepoMock.getAuthors).toBeCalledWith({ids: ids});
    });
  });

  describe('add author function', () => {
    test('should call repository', async () => {
      const requestId = 'test_request_1234';
      const author = {
        id: '',
        name: 'test author',
      };
      await blogService.addAuthor(principal, requestId, author);

      expect(blogRepoMock.addAuthor).toBeCalledTimes(1);
      expect(blogRepoMock.addAuthor).toBeCalledWith(author);
    });

    test('should be an idempotent request', async () => {
      const requestId = 'test_request_1234';
      const author = {
        id: '',
        name: 'test author',
      };
      await blogService.addAuthor(principal, requestId, author);

      expect(idempotentRequestHelper.handleIdempotentRequest).toBeCalledTimes(
        1
      );
    });
  });

  describe('add blog post function', () => {
    beforeEach(() => {
      blogRepoMock.addBlogPost.mockResolvedValue({
        id: 'new_blog_post_id',
        authorId: 'authorId',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    test('should call repository', async () => {
      const requestId = 'test_request_1234';
      const blogPost = {
        id: '',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      };
      await blogService.addBlogPost(principal, requestId, blogPost);

      expect(blogRepoMock.addBlogPost).toBeCalledTimes(1);
      expect(blogRepoMock.addBlogPost).toBeCalledWith(blogPost);
    });

    test('should be an idempotent request', async () => {
      const requestId = 'test_request_1234';
      const blogPost = {
        id: '',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      };
      await blogService.addBlogPost(principal, requestId, blogPost);

      expect(idempotentRequestHelper.handleIdempotentRequest).toBeCalledTimes(
        1
      );
    });

    test('should publish a blog post added event', async () => {
      const requestId = 'test_request_1234';
      const blogPost = {
        id: '',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      };
      await blogService.addBlogPost(principal, requestId, blogPost);

      expect(baseParams.eventHelper.publishEvent).toBeCalledTimes(1);
    });
  });

  describe('update blog post function', () => {
    test('should call repository', async () => {
      const requestId = 'test_request_1234';
      const blogPost = {
        id: '',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      };
      await blogService.updateBlogPost(principal, requestId, blogPost);

      expect(blogRepoMock.updateBlogPost).toBeCalledTimes(1);
      expect(blogRepoMock.updateBlogPost).toBeCalledWith(blogPost);
    });

    test('should be an idempotent request', async () => {
      const requestId = 'test_request_1234';
      const blogPost = {
        id: '',
        title: 'test title',
        text: 'test text',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      };
      await blogService.updateBlogPost(principal, requestId, blogPost);

      expect(idempotentRequestHelper.handleIdempotentRequest).toBeCalledTimes(
        1
      );
    });
  });
});
