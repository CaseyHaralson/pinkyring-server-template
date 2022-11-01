import {Todo} from '../dtos/todo';
import ITodoRepository from '../interfaces/ITodoRepository';

class TodoService {
  private _todoRepository;
  constructor(todoRepository: ITodoRepository) {
    this._todoRepository = todoRepository;
  }

  getTodos() {
    return this._todoRepository.getTodos();
  }

  createTodo(todo: Todo) {
    return this._todoRepository.saveTodo(todo);
  }

  updateTodo(todo: Todo) {
    return this._todoRepository.saveTodo(todo);
  }

  deleteTodo(id: string) {
    return this._todoRepository.deleteTodo(id);
  }
}

export default TodoService;
