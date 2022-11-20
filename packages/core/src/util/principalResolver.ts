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
