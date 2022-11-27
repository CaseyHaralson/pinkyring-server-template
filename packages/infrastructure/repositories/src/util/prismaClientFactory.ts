import {PrismaClient} from '@prisma/client';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';
import {Environment} from '@pinkyring/core/dtos/enums';

const CONFIGKEYNAME_MYSQL_DATABASE_URL = 'MYSQL_DATABASE_URL';

export default class PrismaClientFactory extends BaseClass {
  constructor(baseParams: IBaseParams) {
    super(baseParams, '', [
      {
        name: CONFIGKEYNAME_MYSQL_DATABASE_URL,
        loadIntoEnv: true,
      },
    ]);
  }

  createPrismaClient() {
    if (this.getEnvironment() === Environment.DEVELOPMENT) {
      return new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    } else {
      return new PrismaClient({
        log: ['info', 'warn', 'error'],
      });
    }
  }
}
