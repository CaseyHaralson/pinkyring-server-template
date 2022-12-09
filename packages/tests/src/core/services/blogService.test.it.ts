import container from '@pinkyring/di-container/container';
import {v4 as uuidv4} from 'uuid';

describe('todo service integration tests', () => {
  const service = container.resolveBlogService();
  const eventHelper = container.resolveEventHelper();

  beforeEach(async () => {
    // delete test authors
    // delete test blog posts
    // delete idempotent requests
    // what about bus/queue stuff?
  });

  describe(`get blog posts function`, () => {
    test('should return blog posts', async () => {
      const principal = container
        .resolvePrincipalResolver()
        .resolveMachinePrincipal('blogService integration tester');
      const blogPosts = await service.getBlogPosts(principal, {});

      expect(blogPosts.length).toBeGreaterThan(0);
    });
  });

  describe(`get authors function`, () => {
    test('should return authors', async () => {
      const principal = container
        .resolvePrincipalResolver()
        .resolveMachinePrincipal('blogService integration tester');
      const authors = await service.getAuthors(principal, {});

      expect(authors.length).toBeGreaterThan(0);
    });
  });

  describe(`add author function`, () => {
    test('should add and return author', async () => {
      const principal = container
        .resolvePrincipalResolver()
        .resolveMachinePrincipal('blogService integration tester');
      const requestId = uuidv4();
      const author = await service.addAuthor(principal, requestId, {
        id: '',
        name: 'new it author',
      });

      expect(author).not.toBe(null);
      expect(author).not.toBe(undefined);

      const foundAuthors = await service.getAuthors(principal, {
        ids: [author.id],
      });
      expect(foundAuthors.length).toBe(1);
      expect(foundAuthors[0].name).toBe(author.name);
    });
  });

  describe(`add blog post function`, () => {
    test('should add and return blog post', async () => {
      const principal = container
        .resolvePrincipalResolver()
        .resolveMachinePrincipal('blogService integration tester');
      const authors = await service.getAuthors(principal, {});

      const requestId = uuidv4();
      const blogPost = await service.addBlogPost(principal, requestId, {
        id: '',
        authorId: authors[0].id,
        title: 'integration test title',
        text: 'integration test text',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(blogPost).not.toBe(null);
      expect(blogPost).not.toBe(undefined);

      const foundBlogPosts = await service.getBlogPosts(principal, {
        ids: [blogPost.id],
      });
      expect(foundBlogPosts.length).toBe(1);
      expect(foundBlogPosts[0].authorId).toBe(blogPost.authorId);
      expect(foundBlogPosts[0].title).toBe(blogPost.title);
      expect(foundBlogPosts[0].text).toBe(blogPost.text);
    });
  });
});
