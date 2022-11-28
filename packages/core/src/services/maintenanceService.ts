import BaseService, {IBaseServiceParams} from './baseService';

export default class MaintenanceService extends BaseService {
  constructor(baseServiceParams: IBaseServiceParams) {
    super(baseServiceParams, 'MaintenanceService');
  }

  async cleanOldIdempotentRequests() {
    await this._baseServiceParams.idempotentRequestHelper.cleanOldIdempotentRequests();
  }
}
