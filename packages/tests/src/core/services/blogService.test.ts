import BlogService from '@pinkyring/core/services/blogService';
import IBlogRepository from '@pinkyring/core/interfaces/IBlogRepository';
import {mock, mockReset} from 'jest-mock-extended';
import IBaseParams, {
  IIdempotentRequestRepository,
} from '@pinkyring/core/interfaces/IBaseParams';
import Logger, {SubjectLogger} from '@pinkyring/core/interfaces/ILogger';

describe('blog service unit tests', () => {
  const baseParams = mock<IBaseParams>();
  baseParams.logger = mock<Logger>();
  baseParams.idempotentRequestRepository = mock<IIdempotentRequestRepository>();
  const blogRepoMock = mock<IBlogRepository>();
  const blogService = new BlogService(baseParams, blogRepoMock);

  beforeEach(() => {
    mockReset(baseParams.logger);
    baseParams.logger.newSubjectLogger = jest.fn(() => {
      return mock<SubjectLogger>();
    });
    mockReset(baseParams.idempotentRequestRepository);
    baseParams.idempotentRequestRepository.createRequest = jest.fn(() => {
      return Promise.resolve(true);
    });
    mockReset(blogRepoMock);
  });

  describe('get blog posts function', () => {
    test('should call repository', async () => {
      await blogService.getBlogPosts({});

      expect(blogRepoMock.getBlogPosts).toBeCalledTimes(1);
    });

    test('should call repository with ids', async () => {
      const ids = ['1', '2', '3', '4'];
      await blogService.getBlogPosts({ids: ids});

      expect(blogRepoMock.getBlogPosts).toBeCalledTimes(1);
      expect(blogRepoMock.getBlogPosts).toBeCalledWith({ids: ids});
    });
  });

  describe('get authors function', () => {
    test('should call repository', async () => {
      await blogService.getAuthors({});

      expect(blogRepoMock.getAuthors).toBeCalledTimes(1);
    });

    test('should call repository with ids', async () => {
      const ids = ['1', '2', '3', '4'];
      await blogService.getAuthors({ids: ids});

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
      await blogService.addAuthor(requestId, author);

      expect(blogRepoMock.addAuthor).toBeCalledTimes(1);
      expect(blogRepoMock.addAuthor).toBeCalledWith(author);
    });

    test('should be an idempotent request', async () => {
      const requestId = 'test_request_1234';
      const author = {
        id: '',
        name: 'test author',
      };
      await blogService.addAuthor(requestId, author);

      expect(
        baseParams.idempotentRequestRepository.createRequest
      ).toBeCalledTimes(1);
      expect(
        baseParams.idempotentRequestRepository.createRequest
      ).toBeCalledWith(requestId);
      expect(
        baseParams.idempotentRequestRepository.saveRequestResult
      ).toBeCalledTimes(1);
      //expect(blogService.idempotentRequest).toBeCalledWith(author);
    });
  });
});
