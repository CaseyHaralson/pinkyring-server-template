export default interface Principal {
  identity: Identity;
  roles: Role[];
}

export interface Identity {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}
