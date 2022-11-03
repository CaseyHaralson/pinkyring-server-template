import {Todo} from '../dtos/todo';

interface ITodoRepository {
  getTodos(): Promise<Todo[]>;
  saveTodo(todo: Todo): Promise<string>;
  markTodoCompleted(todo: Todo): Promise<boolean>;
  deleteTodo(id: string): Promise<boolean>;
}

export default ITodoRepository;
