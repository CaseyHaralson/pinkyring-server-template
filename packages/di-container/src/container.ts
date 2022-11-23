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
import WinstonLogger from '@pinkyring/infrastructure_logging/winstonLogger';
import IdempotentRequestHelper from '@pinkyring/core/util/idempotentRequestHelper';
import Logger from '@pinkyring/core/util/logger';
import PrincipalResolver from '@pinkyring/core/util/principalResolver';
import EventHelper from '@pinkyring/core/util/eventHelper';
import LocalEventRepository from '@pinkyring/infrastructure_queue/eventRepository';
import ServerEventRepository from '@pinkyring/infrastructure_aws_snqs/eventRepository';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

const loadContainer = function () {
  // can check for environment to load specific container type
  if (process.env.NODE_ENV !== 'dev') {
    loadServerItems();
  } else {
    loadLocalItems();
  }

  loadGenericItems();
};

const loadGenericItems = function () {
  awilix_container.register({
    testService: asClass(TestService),
    testRepository: asClass(TestRepository),
  });
  awilix_container.register({
    todoService: asClass(TodoService),
    todoRepository: asClass(TodoRepository),
  });
  awilix_container.register({
    principalResolver: asClass(PrincipalResolver),
  });
  awilix_container.register({
    blogService: asClass(BlogService),
    blogRepository: asClass(BlogRepository),
  });
  awilix_container.register({
    logger: asClass(Logger),
    iLogHandler: asClass(WinstonLogger).singleton(),
    idempotentRequestHelper: asClass(IdempotentRequestHelper),
    idempotentRequestRepository: asClass(IdempotentRequestRepository),
    eventHelper: asClass(EventHelper),
    //eventRepository: asClass(EventRepository),
    baseParams: asFunction(() => {
      return {
        logger: awilix_container.cradle.logger,
        idempotentRequestHelper:
          awilix_container.cradle.idempotentRequestHelper,
        eventHelper: awilix_container.cradle.eventHelper,
      } as IBaseParams;
    }),
  });
  awilix_container.register({
    prismaClient: asFunction(prisma).singleton(),
  });
};

const loadLocalItems = function () {
  awilix_container.register({
    eventRepository: asClass(LocalEventRepository),
  });
};

const loadServerItems = function () {
  awilix_container.register({
    eventRepository: asClass(ServerEventRepository),
  });
};

class Container {
  private _container;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(container: AwilixContainer<any>) {
    this._container = container;
  }

  resolvePrincipalResolver() {
    return this._container.cradle.principalResolver as PrincipalResolver;
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

  resolveEventHelper() {
    return this._container.cradle.eventHelper as EventHelper;
  }
}

loadContainer();
const container = new Container(awilix_container);
export default container;
