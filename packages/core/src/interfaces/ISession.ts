import Principal from './IPrincipal';

export default interface ISessionHandler {
  newSession<T>(principal: Principal, func: () => Promise<T>): Promise<T>;
  getSession(): Session;
}

// unique requestId
// principal
//

export interface Session {
  principal: Principal;
  requestId: string;
}
