import Principal from '../dtos/principal';

export default class PrincipalResolver {
  resolve() {
    return {
      identity: {
        id: 'some_identity_id',
        name: 'some_identity_name',
      },
      roles: [
        {
          id: 'generic_role_id',
          name: 'generic_role',
        },
      ],
    } as Principal;
  }
}

export const UnknownPrincipal = {
  identity: {
    id: 'unknown_id',
    name: 'unknown_name',
  },
  roles: [],
} as Principal;
