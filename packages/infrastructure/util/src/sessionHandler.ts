import Principal from '@pinkyring/core/interfaces/IPrincipal';
import ISessionHandler, {Session} from '@pinkyring/core/interfaces/ISession';
import {createNamespace, getNamespace, Namespace} from 'cls-hooked';
import {v4 as uuidv4} from 'uuid';

const NAMESPACE_NAME = 'pinkyring.session';
const SESSION_VALUES = 'values';

// can't extend the BaseClass because one of the the base class parameters needs this as a parameter
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
        namespace.set(SESSION_VALUES, {
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
    const values = namespace.get(SESSION_VALUES);
    if (values !== undefined) return true;
    return false;
  }

  getSession(): Session {
    const namespace = getNamespace(NAMESPACE_NAME);
    return namespace?.get(SESSION_VALUES) as Session;
  }
}
