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

export const UnknownPrincipal = {
  identity: {
    id: 'unknown_id',
    name: 'unknown_name',
  },
  roles: [],
} as Principal;
