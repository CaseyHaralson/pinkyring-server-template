

class TestService {

  test(message: string) {
    console.log('message from the TestService test function: ' + message);
    return 'got the message: ' + message;
  }

}

export default TestService;