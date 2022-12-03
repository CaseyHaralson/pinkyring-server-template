import Principal from '@pinkyring/core/interfaces/IPrincipal';
import ISessionHandler, {Session} from '@pinkyring/core/interfaces/ISession';
import {createNamespace, getNamespace} from 'cls-hooked';

export default class SessionHandler implements ISessionHandler {
  newSession<T>(principal: Principal, func: () => Promise<T>): Promise<T> {
    const session = createNamespace('session');
    return session.runPromise(async () => {
      session.set('values', {
        principal: principal,
        requestId: '1234',
      } as Session);

      return await func();
    });
  }

  getSession(): Session {
    const session = getNamespace('session');
    return session?.get('values') as Session;
  }
}
