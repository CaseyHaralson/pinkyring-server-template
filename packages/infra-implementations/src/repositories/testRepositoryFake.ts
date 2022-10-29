import TestRepository from '@pinkyring/core/interfaces/testRepository';

class TestRepositoryFake implements TestRepository {
  getTestData(): string[] {
    return [
      'test value 1 from fake repo',
      'test value 2 from fake repo',
      'test value 3 from fake repo',
    ];
  }
}

export default TestRepositoryFake;
