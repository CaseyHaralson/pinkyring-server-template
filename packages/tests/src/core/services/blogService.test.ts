import BlogService from '@pinkyring/core/services/blogService';
import IBlogRepository from '@pinkyring/core/interfaces/IBlogRepository';
import {mock, mockReset} from 'jest-mock-extended';
import IBaseParams from '@pinkyring/core/interfaces/IBaseParams';

describe('blog service unit tests', () => {
  const baseParams = mock<IBaseParams>();
  const blogRepoMock = mock<IBlogRepository>();
  const blogService = new BlogService(baseParams, blogRepoMock);

  beforeEach(() => {
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
});
