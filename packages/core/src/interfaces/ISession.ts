import Principal from './IPrincipal';

export default interface ISessionHandler {
  newSessionIfNotExists<T>(
    principal: Principal,
    func: () => Promise<T>
  ): Promise<T>;
  getSession(): Session;
}

export interface Session {
  sessionId: string;
  principal: Principal;
}
