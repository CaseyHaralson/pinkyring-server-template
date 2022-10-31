import {Todo} from '../dtos/todo';

interface TodoRepository {
  getTodos(): Todo[];
  saveTodo(todo: Todo): string;
  deleteTodo(id: string): boolean;
}

export default TodoRepository;
