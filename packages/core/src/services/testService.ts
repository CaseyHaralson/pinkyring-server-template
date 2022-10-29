import TestRepository from '../interfaces/testRepository';

class TestService {
  private _testRepository;
  constructor(testRepository: TestRepository) {
    this._testRepository = testRepository;
  }

  test(message: string) {
    console.log('message from the TestService test function: ' + message);
    return 'got the message: ' + message + '2';
  }

  getData() {
    return this._testRepository.getTestData();
  }
}

export default TestService;
