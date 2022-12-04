import Principal from '@pinkyring/core/interfaces/IPrincipal';
import {v4 as uuidv4} from 'uuid';

/**
 * Resolves security principals based on the information defined in the resolve function.
 */
export default class PrincipalResolver {
  /**
   * Define the information necessary to resolve security principals here.
   * The apps that use this resolver can pass in the needed information in return for the security principal.
   */
  resolve() {
    return {
      identity: {
        id: uuidv4(),
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
