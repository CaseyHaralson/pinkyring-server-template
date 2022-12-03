import Principal from '@pinkyring/core/interfaces/IPrincipal';
import ISessionHandler, {Session} from '@pinkyring/core/interfaces/ISession';
import {createNamespace, getNamespace, Namespace} from 'cls-hooked';
import {v4 as uuidv4} from 'uuid';

const NAMESPACE_NAME = 'session';

export default class SessionHandler implements ISessionHandler {
  newSessionIfNotExists<T>(
    principal: Principal,
    func: () => Promise<T>
  ): Promise<T> {
    const namespace = this.createNamespaceIfNotExists();
    if (this.sessionExists(namespace)) {
      return func();
    } else {
      return namespace.runPromise(async () => {
        namespace.set('values', {
          sessionId: uuidv4(),
          principal: principal,
        } as Session);

        return await func();
      });
    }
  }

  private createNamespaceIfNotExists() {
    let namespace = getNamespace(NAMESPACE_NAME);
    if (namespace === undefined) {
      namespace = createNamespace(NAMESPACE_NAME);
    }
    return namespace;
  }

  private sessionExists(namespace: Namespace) {
    const values = namespace.get('values');
    if (values !== undefined) return true;
    return false;
  }

  getSession(): Session {
    const namespace = getNamespace(NAMESPACE_NAME);
    return namespace?.get('values') as Session;
  }
}
