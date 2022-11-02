import TodoService from '@pinkyring/core/services/todoService';
import ITodoRepository from '@pinkyring/core/interfaces/ITodoRepository';
import {Todo} from '@pinkyring/core/dtos/todo';
import {mock, mockReset} from 'jest-mock-extended';

describe('todo service', () => {
  const todoRepoMock = mock<ITodoRepository>();
  const todoService = new TodoService(todoRepoMock);

  beforeEach(() => {
    mockReset(todoRepoMock);
  });

  describe('get todos function', () => {
    test('should return todos', () => {
      const todo = {
        id: '1234',
        text: 'test todos',
        completed: false,
        createdDt: '2022-10-31 17:00:00',
        completedDt: undefined,
      };
      todoRepoMock.getTodos.mockReturnValue([todo]);

      const returnValue = todoService.getTodos();

      expect(returnValue).toBeDefined();
      expect(returnValue.length).toBe(1);
      expect(returnValue[0]).toBe(todo);
    });
  });

  describe('create todo function', () => {
    test('should call todo repo', () => {
      const todo = {
        text: 'test todos',
      } as Todo;
      todoRepoMock.saveTodo.mockReturnValue('1234');

      const returnValue = todoService.createTodo(todo);

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe('1234');
      expect(todoRepoMock.saveTodo).toBeCalledTimes(1);
    });
  });

  describe('update todo function', () => {
    test('should call todo repo', () => {
      const todo = {
        id: '1234',
        text: 'test todos',
        completed: true,
      } as Todo;
      todoRepoMock.saveTodo.mockReturnValue('1234');

      const returnValue = todoService.updateTodo(todo);

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe('1234');
      expect(todoRepoMock.saveTodo).toBeCalledTimes(1);
    });
  });

  describe('delete todo function', () => {
    test('should call todo repo', () => {
      todoRepoMock.deleteTodo.mockReturnValue(true);

      const returnValue = todoService.deleteTodo('1234');

      expect(returnValue).toBeDefined();
      expect(returnValue).toBe(true);
      expect(todoRepoMock.deleteTodo).toBeCalledTimes(1);
    });
  });
});
