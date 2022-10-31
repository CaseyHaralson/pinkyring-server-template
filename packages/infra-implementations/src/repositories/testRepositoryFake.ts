import TodoRepository from '@pinkyring/core/interfaces/todoRepository';

class TestRepositoryFake implements TodoRepository {
  getTestData(): string[] {
    return [
      'test value 1 from fake repo',
      'test value 2 from fake repo',
      'test value 3 from fake repo',
    ];
  }
}

export default TestRepositoryFake;
