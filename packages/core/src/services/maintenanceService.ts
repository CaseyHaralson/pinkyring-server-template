import Principal from '../interfaces/IPrincipal';
import BaseService, {IBaseServiceParams} from './baseService';

export default class MaintenanceService extends BaseService {
  constructor(baseServiceParams: IBaseServiceParams) {
    super(baseServiceParams, 'MaintenanceService');
  }

  async cleanOldIdempotentRequests(principal: Principal) {
    await this.session(principal, async () => {
      await this._baseServiceParams.idempotentRequestHelper.cleanOldIdempotentRequests();
    });
  }
}
