import {createContainer, AwilixContainer} from 'awilix';
import TestService from '@pinkyring/core/services/testService';
import TodoService from '@pinkyring/core/services/todoService';
import BlogService from '@pinkyring/core/services/blogService';
import PrincipalResolver from '@pinkyring/core/util/principalResolver';
import EventHelper from '@pinkyring/core/util/eventHelper';
import ConfigHelper from '@pinkyring/core/util/configHelper';
import MaintenanceService from '@pinkyring/core/services/maintenanceService';
import loadContainer from './containerLoader';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

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

  resolveMaintenanceService() {
    return this._container.cradle.maintenanceService as MaintenanceService;
  }

  resolveConfigHelper() {
    return this._container.cradle.configHelper as ConfigHelper;
  }

  resolveEventHelper() {
    return this._container.cradle.eventHelper as EventHelper;
  }
}

loadContainer(awilix_container);
const container = new Container(awilix_container);
export default container;
