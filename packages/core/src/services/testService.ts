import ITestRepository from '../interfaces/ITestRepository';

class TestService {
  private _testRepository;
  constructor(testRepository: ITestRepository) {
    this._testRepository = testRepository;
  }

  test(message: string) {
    console.log('message from the TestService test function: ' + message);
    return 'got the message: ' + message;
  }

  getData() {
    return this._testRepository.getTestData();
  }
}

export default TestService;
