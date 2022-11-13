import ITodoRepository from '@pinkyring/core/interfaces/ITodoRepository';
import {Todo} from '@pinkyring/core/dtos/todo';
import {PrismaClient} from '@prisma/client';

class TodoRepository implements ITodoRepository {
  private _prismaClient;
  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  async getTodos(searchText?: string): Promise<Todo[]> {
    const todos =
      searchText === undefined
        ? await this._prismaClient.todo.findMany()
        : await this._prismaClient.todo.findMany({
            where: {
              text: {
                search: searchText,
              },
            },
          });
    return todos as unknown as Todo[];
  }

  async saveTodo(todo: Todo): Promise<string> {
    if (todo.id === undefined) {
      const newTodo = await this._prismaClient.todo.create({
        data: {
          text: todo.text,
          completed: todo.completed,
          createdDt: new Date(),
          completedDt: todo.completed ? new Date() : null,
        },
      });

      return newTodo.id;
    } else {
      await this._prismaClient.todo.update({
        where: {
          id: todo.id,
        },
        data: {
          text: todo.text,
        },
      });

      return todo.id;
    }
  }

  async markTodoCompleted(todo: Todo): Promise<boolean> {
    await this._prismaClient.todo.update({
      where: {
        id: todo.id,
      },
      data: {
        completed: true,
        completedDt: new Date(),
      },
    });

    return true;
  }

  async deleteTodo(id: string): Promise<boolean> {
    await this._prismaClient.todo.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}

export default TodoRepository;
