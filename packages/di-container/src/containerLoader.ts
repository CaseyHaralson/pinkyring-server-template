import {asClass, asFunction, asValue, AwilixContainer} from 'awilix';
import ConfigHelper from '@pinkyring/core/util/configHelper';
import ConfigFileReader from '@pinkyring/infrastructure_util/configFileReader';
import {Environment} from '@pinkyring/core/dtos/enums';
import LocalEventRepository from '@pinkyring/infrastructure_queue/eventRepository';
import ServerEventRepository from '@pinkyring/infrastructure_aws_snqs/eventRepository';
import PrincipalResolver from '@pinkyring/core/util/principalResolver';
import Logger from '@pinkyring/core/util/logger';
import WinstonLogger from '@pinkyring/infrastructure_logging/winstonLogger';
import {IBaseParams} from '@pinkyring/core/util/baseClass';
import IdempotentRequestHelper from '@pinkyring/core/util/idempotentRequestHelper';
import IdempotentRequestRepository from '@pinkyring/infrastructure_repositories/idempotentRequestRepository';
import EventHelper from '@pinkyring/core/util/eventHelper';
import {IBaseServiceParams} from '@pinkyring/core/services/baseService';
import BlogService from '@pinkyring/core/services/blogService';
import BlogRepository from '@pinkyring/infrastructure_repositories/blogRepository';
import MaintenanceService from '@pinkyring/core/services/maintenanceService';
import TodoService from '@pinkyring/core/services/todoService';
import TodoRepository from '@pinkyring/infrastructure_repositories/todoRepository';
import TestService from '@pinkyring/core/services/testService';
import TestRepository from '@pinkyring/infrastructure_repositories/testRepository';
import PrismaClientFactory from '@pinkyring/infrastructure_repositories/util/prismaClientFactory';

export default function loadContainer(container: AwilixContainer) {
  loadConfigHelper(container);
  const configHelper = container.cradle.configHelper as ConfigHelper;

  if (configHelper.getEnvironment() === Environment.DEVELOPMENT) {
    loadLocalItems(container);
  } else {
    loadServerItems(container);
  }

  loadGenericItems(container);
}

const loadConfigHelper = function (container: AwilixContainer) {
  container.register({
    configHelper: asClass(ConfigHelper),
    configFileReader: asClass(ConfigFileReader).singleton(),
    secretRepository: asValue(null), // currently not using a secrets repo for this project
  });
};

// ====================================
//        load local items

const loadLocalItems = function (container: AwilixContainer) {
  container.register({
    eventRepository: asClass(LocalEventRepository),
  });
};

// ====================================

// ====================================
//        load server items

const loadServerItems = function (container: AwilixContainer) {
  container.register({
    eventRepository: asClass(ServerEventRepository),
  });
};

// ====================================

// ====================================
//        load gerneric items

const loadGenericItems = function (container: AwilixContainer) {
  // base class parameters and base service parameters
  container.register({
    logger: asClass(Logger),
    iLogHandler: asFunction(() => {
      const logger = new WinstonLogger({
        logger: asValue(null) as unknown as Logger, // can't include a logger in Winston because that creates a circular dependency, because Winston IS the logger
        configHelper: container.cradle.configHelper as ConfigHelper,
      } as IBaseParams);
      return logger;
    }).singleton(),
    baseParams: asFunction(() => {
      return {
        logger: container.cradle.logger,
        configHelper: container.cradle.configHelper,
      } as IBaseParams;
    }),
    idempotentRequestHelper: asClass(IdempotentRequestHelper),
    idempotentRequestRepository: asClass(IdempotentRequestRepository),
    eventHelper: asClass(EventHelper),
    baseServiceParams: asFunction(() => {
      return {
        logger: container.cradle.logger,
        configHelper: container.cradle.configHelper,
        idempotentRequestHelper: container.cradle.idempotentRequestHelper,
        eventHelper: container.cradle.eventHelper,
      } as IBaseServiceParams;
    }),
  });
  // end base class parameters and base service parameters

  container.register({
    principalResolver: asClass(PrincipalResolver),
  });

  container.register({
    maintenanceService: asClass(MaintenanceService),
    blogService: asClass(BlogService),
    blogRepository: asClass(BlogRepository),
    todoService: asClass(TodoService),
    todoRepository: asClass(TodoRepository),
    testService: asClass(TestService),
    testRepository: asClass(TestRepository),
  });

  container.register({
    prismaClientFactory: asClass(PrismaClientFactory),
    prismaClient: asFunction(() => {
      const factory = container.cradle
        .prismaClientFactory as PrismaClientFactory;
      return factory.createPrismaClient();
    }).singleton(),
  });
};

// ====================================
