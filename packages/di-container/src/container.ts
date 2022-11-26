import {
  createContainer,
  asClass,
  AwilixContainer,
  asFunction,
  asValue,
} from 'awilix';
import TestService from '@pinkyring/core/services/testService';
import TestRepository from '@pinkyring/infrastructure_repositories/testRepository';
import TodoService from '@pinkyring/core/services/todoService';
import TodoRepository from '@pinkyring/infrastructure_repositories/todoRepository';
import BlogService from '@pinkyring/core/services/blogService';
import BlogRepository from '@pinkyring/infrastructure_repositories/blogRepository';
import IdempotentRequestRepository from '@pinkyring/infrastructure_repositories/idempotentRequestRepository';
import WinstonLogger from '@pinkyring/infrastructure_logging/winstonLogger';
import IdempotentRequestHelper from '@pinkyring/core/util/idempotentRequestHelper';
import Logger from '@pinkyring/core/util/logger';
import PrincipalResolver from '@pinkyring/core/util/principalResolver';
import EventHelper from '@pinkyring/core/util/eventHelper';
import LocalEventRepository from '@pinkyring/infrastructure_queue/eventRepository';
import ServerEventRepository from '@pinkyring/infrastructure_aws_snqs/eventRepository';
import ConfigHelper from '@pinkyring/core/util/configHelper';
import ConfigFileReader from '@pinkyring/infrastructure_util/configFileReader';
import {IBaseParams} from '@pinkyring/core/util/baseClass';
import {IBaseServiceParams} from '@pinkyring/core/services/baseService';
import PrismaClientFactory from '@pinkyring/infrastructure_repositories/util/prismaClientFactory';
import {Environment} from '@pinkyring/core/dtos/enums';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

const loadContainer = function () {
  loadConfigHelper();
  const configHelper = awilix_container.cradle.configHelper as ConfigHelper;

  // can check for environment to load specific container type
  if (configHelper.getEnvironment() === Environment.DEVELOPMENT) {
    loadLocalItems();
  } else {
    loadServerItems();
  }

  loadGenericItems();
};

const loadConfigHelper = function () {
  awilix_container.register({
    configHelper: asClass(ConfigHelper),
    configFileReader: asClass(ConfigFileReader).singleton(),
    secretRepository: asValue(null), // currently not using a secrets repo for this project
  });
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
    baseParams: asFunction(() => {
      return {
        logger: awilix_container.cradle.logger,
        configHelper: awilix_container.cradle.configHelper,
      } as IBaseParams;
    }),
  });
  awilix_container.register({
    idempotentRequestHelper: asClass(IdempotentRequestHelper),
    idempotentRequestRepository: asClass(IdempotentRequestRepository),
    eventHelper: asClass(EventHelper),
    baseServiceParams: asFunction(() => {
      return {
        logger: awilix_container.cradle.logger,
        configHelper: awilix_container.cradle.configHelper,
        idempotentRequestHelper:
          awilix_container.cradle.idempotentRequestHelper,
        eventHelper: awilix_container.cradle.eventHelper,
      } as IBaseServiceParams;
    }),
  });
  awilix_container.register({
    prismaClientFactory: asClass(PrismaClientFactory),
    prismaClient: asFunction(() => {
      const factory = awilix_container.cradle
        .prismaClientFactory as PrismaClientFactory;
      return factory.createPrismaClient();
    }).singleton(),
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

  resolveConfigHelper() {
    return this._container.cradle.configHelper as ConfigHelper;
  }

  resolveEventHelper() {
    return this._container.cradle.eventHelper as EventHelper;
  }
}

loadContainer();
const container = new Container(awilix_container);
export default container;
