import TodoRepository from '../interfaces/todoRepository';

class TodoService {
  private _todoRepository;
  constructor(todoRepository: TodoRepository) {
    this._todoRepository = todoRepository;
  }

  test(message: string) {
    console.log('message from the TestService test function: ' + message);
    return 'got the message: ' + message;
  }

  getData() {
    return this._todoRepository.getTestData();
  }
}

export default TodoService;
