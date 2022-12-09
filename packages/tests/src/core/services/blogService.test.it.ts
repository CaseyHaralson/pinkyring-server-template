import container from '@pinkyring/di-container/container';

describe('todo service integration tests', () => {
  const service = container.resolveBlogService();

  beforeEach(async () => {
    //
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
      const requestId = 'addAuthor1234';
      const author = await service.addAuthor(principal, requestId, {
        id: 'unused',
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
});
