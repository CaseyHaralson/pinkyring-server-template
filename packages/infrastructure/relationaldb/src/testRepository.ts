import ITestRepository from '@pinkyring/core/interfaces/ITestRepository';

class TestRepositoryFake implements ITestRepository {
  getTestData(): string[] {
    return [
      'test value 1 from fake repo',
      'test value 2 from fake repo',
      'test value 3 from fake repo',
    ];
  }
}

export default TestRepositoryFake;
