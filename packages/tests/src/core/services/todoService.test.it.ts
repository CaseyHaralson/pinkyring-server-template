import container from '@pinkyring/di-container/container';

describe('todo service integration tests', () => {
  const todoService = container.resolveTodoService();

  // TODO: figure out how to mock the other service dependencies
  // so you can run integration tests against one piece at a time

  let testTodoId: string;
  beforeEach(async () => {
    // delete any todos left in the database
    const todos = await todoService.getTodos();
    const todosLength = todos.length;
    for (let i = 0; i < todosLength; i++) {
      await todoService.deleteTodo(todos[i].id as string);
    }

    // create a todo
    testTodoId = await todoService.createTodo({
      text: 'test todo',
      completed: false,
    });
  });

  describe('get todos function', () => {
    test('should return todos', async () => {
      const todos = await todoService.getTodos();

      expect(todos.length).toBe(1);
    });
  });

  describe('create todo function', () => {
    test('should create todo', async () => {
      const todoId = await todoService.createTodo({
        text: 'create todo',
        completed: false,
      });

      const todos = await todoService.getTodos();
      const todosLength = todos.length;
      let foundNewTodo = false;
      for (let i = 0; i < todosLength; i++) {
        if ((todos[i].id as string) === todoId) {
          foundNewTodo = true;
          break;
        }
      }

      expect(foundNewTodo).toBe(true);
    });
  });

  describe('update todo function', () => {
    test('should update todo', async () => {
      await todoService.updateTodo({
        id: testTodoId,
        text: 'updated todo text',
        completed: false,
      });

      const todos = await todoService.getTodos();
      const todosLength = todos.length;
      let foundUpdatedTodo = false;
      for (let i = 0; i < todosLength; i++) {
        if ((todos[i].id as string) === testTodoId) {
          expect(todos[i].text === 'updated todo text');
          foundUpdatedTodo = true;
          break;
        }
      }

      expect(foundUpdatedTodo).toBe(true);
    });
  });

  describe('mark todo completed function', () => {
    test('should update todo', async () => {
      await todoService.markTodoCompleted({
        id: testTodoId,
        text: 'dont care',
        completed: true,
      });

      const todos = await todoService.getTodos();
      const todosLength = todos.length;
      let foundUpdatedTodo = false;
      for (let i = 0; i < todosLength; i++) {
        if ((todos[i].id as string) === testTodoId) {
          expect(todos[i].completed === true);
          foundUpdatedTodo = true;
          break;
        }
      }

      expect(foundUpdatedTodo).toBe(true);
    });
  });

  describe('delete todo function', () => {
    test('should delete todo', async () => {
      let todos = await todoService.getTodos();
      expect(todos.length).toBe(1);

      await todoService.deleteTodo(testTodoId);

      todos = await todoService.getTodos();
      expect(todos.length).toBe(0);
    });
  });
});
