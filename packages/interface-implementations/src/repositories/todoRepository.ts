import ITodoRepository from '@pinkyring/core/interfaces/ITodoRepository';
import {Todo} from '@pinkyring/core/dtos/todo';

class TodoRepository implements ITodoRepository {
  getTodos(): Todo[] {
    throw new Error('Method not implemented.');
  }
  saveTodo(todo: Todo): string {
    console.log(todo);
    throw new Error('Method not implemented.');
  }
  deleteTodo(id: string): boolean {
    console.log(id);
    throw new Error('Method not implemented.');
  }
}

export default TodoRepository;
