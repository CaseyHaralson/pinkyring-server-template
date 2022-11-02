import {Todo} from '../dtos/todo';

interface ITodoRepository {
  getTodos(): Todo[];
  saveTodo(todo: Todo): string;
  deleteTodo(id: string): boolean;
}

export default ITodoRepository;
