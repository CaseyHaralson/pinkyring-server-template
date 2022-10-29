import {createContainer, asClass, AwilixContainer} from 'awilix';
import TestService from '@pinkyring/core/services/testService';
import TestRepositoryFake from '@pinkyring/infra-implementations/repositories/testRepositoryFake';

const awilix_container = createContainer({injectionMode: 'CLASSIC'});

const loadContainer = function () {
  // can check for environment to load specific container type

  return createLocalContainer();
};

const createLocalContainer = function () {
  awilix_container.register({
    testService: asClass(TestService),
  });
  awilix_container.register({
    testRepository: asClass(TestRepositoryFake),
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
}

loadContainer();
const container = new Container(awilix_container);
export default container;
