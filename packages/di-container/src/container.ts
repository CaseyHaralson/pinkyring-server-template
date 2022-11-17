import {createContainer, asClass, AwilixContainer, asFunction} from 'awilix';
import TestService from '@pinkyring/core/services/testService';
import TestRepository from '@pinkyring/infrastructure_repositories/testRepository';
import TodoService from '@pinkyring/core/services/todoService';
import TodoRepository from '@pinkyring/infrastructure_repositories/todoRepository';
import {prisma} from '@pinkyring/infrastructure_repositories/util/db';
import BlogService from '@pinkyring/core/services/blogService';
import BlogRepository from '@pinkyring/infrastructure_repositories/blogRepository';
import IBaseParams from '@pinkyring/core/interfaces/IBaseParams';
import IdempotentRequestRepository from '@pinkyring/infrastructure_repositories/idempotentRequestRepository';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

const loadContainer = function () {
  // can check for environment to load specific container type

  return createLocalContainer();
};

const createLocalContainer = function () {
  awilix_container.register({
    testService: asClass(TestService),
    testRepository: asClass(TestRepository),
  });
  awilix_container.register({
    todoService: asClass(TodoService),
    todoRepository: asClass(TodoRepository),
  });
  awilix_container.register({
    blogService: asClass(BlogService),
    blogRepository: asClass(BlogRepository),
  });
  awilix_container.register({
    idempotentRequestRepository: asClass(IdempotentRequestRepository),
    baseParams: asFunction(() => {
      return {
        idempotentRequestRepository:
          awilix_container.cradle.idempotentRequestRepository,
      } as IBaseParams;
    }),
  });
  awilix_container.register({
    prismaClient: asFunction(prisma).singleton(),
  });
  return awilix_container;
};

class Container {
  private _container;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(container: AwilixContainer<any>) {
    this._container = container;
  }

  resolveTestService() {
    return this._container.cradle.testService as TestService;
  }

  resolveTodoService() {
    return this._container.cradle.todoService as TodoService;
  }

  resolveBlogService() {
    return this._container.cradle.blogService as BlogService;
  }
}

loadContainer();
const container = new Container(awilix_container);
export default container;

//============================================
// shouldn't be putting anything below here or using this thing
// unless you know what you are doing...not sure I do either

// class DecoratorContainer {
//   private _container;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   constructor(container: AwilixContainer<any>) {
//     this._container = container;
//   }

//   resolveIdempotentRepository() {
//     return this._container.cradle.idempotentRepository as IIdempotentRepository;
//   }
// }

// const decoratorContainer = new DecoratorContainer(awilix_container);
// export {decoratorContainer};
