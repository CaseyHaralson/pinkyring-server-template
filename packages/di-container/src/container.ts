import {createContainer, AwilixContainer} from 'awilix';
import BlogService from '@pinkyring/core/services/blogService';
import EventHelper from '@pinkyring/core/util/eventHelper';
import ConfigHelper from '@pinkyring/core/util/configHelper';
import MaintenanceService from '@pinkyring/core/services/maintenanceService';
import loadContainer from './containerLoader';
import PrincipalResolver from '@pinkyring/infrastructure_util/principalResolver';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

/**
 * I expose services and other helpers that allow the external apps to use the core project.
 */
class Container {
  private _container;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(container: AwilixContainer<any>) {
    this._container = container;
  }

  resolveBlogService() {
    return this._container.cradle.blogService as BlogService;
  }

  resolveMaintenanceService() {
    return this._container.cradle.maintenanceService as MaintenanceService;
  }

  /**
   * Resolves the configured PrincipalResolver object.
   * This is exposed so external apps can use their knowledge of the current request to help resolve the security principal.
   * @returns PrincipalResolver
   */
  resolvePrincipalResolver() {
    return this._container.cradle.principalResolver as PrincipalResolver;
  }

  /**
   * Resolves the configured ConfigHelper object.
   * This is exposed so external apps can get their configurations from the same location as the rest of the project.
   * @returns ConfigHelper
   */
  resolveConfigHelper() {
    return this._container.cradle.configHelper as ConfigHelper;
  }

  /**
   * Resolves the configured EventHelper object.
   * This is exposed so an event listener app can interact with the underlying event system.
   * @returns EventHelper
   */
  resolveEventHelper() {
    return this._container.cradle.eventHelper as EventHelper;
  }
}

loadContainer(awilix_container);

/**
 * The DI container that is configured with the project objects.
 * It exposes services and other helpers that allow the external apps to use the core project.
 */
const container = new Container(awilix_container);
export default container;
