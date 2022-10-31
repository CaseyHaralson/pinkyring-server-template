import {Todo} from '../dtos/todo';
import TodoRepository from '../interfaces/todoRepository';

class TodoService {
  private _todoRepository;
  constructor(todoRepository: TodoRepository) {
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
