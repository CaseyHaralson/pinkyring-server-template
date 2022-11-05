import TodoService from '@pinkyring/core/services/todoService';
import ITodoRepository from '@pinkyring/core/interfaces/ITodoRepository';
import {Todo} from '@pinkyring/core/dtos/todo';
import {mock, mockReset} from 'jest-mock-extended';

describe('todo service unit tests', () => {
  const todoRepoMock = mock<ITodoRepository>();
  const todoService = new TodoService(todoRepoMock);

  beforeEach(() => {
    mockReset(todoRepoMock);
  });

  describe('get todos function', () => {
    test('should return todos', async () => {
      const todo = {
        id: '1234',
        text: 'test todos',
        completed: false,
        createdDt: '2022-10-31 17:00:00',
        completedDt: undefined,
      };
      todoRepoMock.getTodos.mockReturnValue(Promise.resolve([todo]));

      const returnValue = await todoService.getTodos();

      expect(returnValue).toBeDefined();
      expect(returnValue.length).toBe(1);
      expect(returnValue[0]).toBe(todo);
    });
  });

  describe('create todo function', () => {
    test('should call todo repo', async () => {
      const todo = {
        text: 'test todos',
      } as Todo;
      todoRepoMock.saveTodo.mockReturnValue(Promise.resolve('1234'));

      const returnValue = await todoService.createTodo(todo);

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe('1234');
      expect(todoRepoMock.saveTodo).toBeCalledTimes(1);
    });
  });

  describe('update todo function', () => {
    test('should call todo repo', async () => {
      const todo = {
        id: '1234',
        text: 'test todos',
        completed: true,
      } as Todo;
      todoRepoMock.saveTodo.mockReturnValue(Promise.resolve('1234'));

      const returnValue = await todoService.updateTodo(todo);

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe('1234');
      expect(todoRepoMock.saveTodo).toBeCalledTimes(1);
    });
  });

  describe('mark todo completed function', () => {
    test('should call todo repo', async () => {
      const todo = {
        id: '1234',
        text: 'test todos',
        completed: true,
      } as Todo;
      todoRepoMock.markTodoCompleted.mockReturnValue(Promise.resolve(true));

      const returnValue = await todoService.markTodoCompleted(todo);

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe(true);
      expect(todoRepoMock.markTodoCompleted).toBeCalledTimes(1);
    });
  });

  describe('delete todo function', () => {
    test('should call todo repo', async () => {
      todoRepoMock.deleteTodo.mockReturnValue(Promise.resolve(true));

      const returnValue = await todoService.deleteTodo('1234');

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe(true);
      expect(todoRepoMock.deleteTodo).toBeCalledTimes(1);
    });
  });
});
