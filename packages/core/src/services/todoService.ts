import {Todo} from '../dtos/todo';
import ITodoRepository from '../interfaces/ITodoRepository';

class TodoService {
  private _todoRepository;
  constructor(todoRepository: ITodoRepository) {
    this._todoRepository = todoRepository;
  }

  // add requestId, current user/principal

  async getTodos() {
    return await this._todoRepository.getTodos();
  }

  async createTodo(todo: Todo) {
    return await this._todoRepository.saveTodo(todo);
  }

  async updateTodo(todo: Todo) {
    return await this._todoRepository.saveTodo(todo);
  }

  async markTodoCompleted(todo: Todo) {
    return await this._todoRepository.markTodoCompleted(todo);
  }

  async deleteTodo(id: string) {
    return await this._todoRepository.deleteTodo(id);
  }
}

export default TodoService;
