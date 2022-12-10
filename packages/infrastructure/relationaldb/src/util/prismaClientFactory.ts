import {PrismaClient} from '@prisma/client';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';
import {Environment} from '@pinkyring/core/util/configHelper';

const CONFIGKEYNAME_MYSQL_DATABASE_URL = 'MYSQL_DATABASE_URL';

export default class PrismaClientFactory extends BaseClass {
  constructor(baseParams: IBaseParams) {
    super(baseParams, 'PrismaClientFactory', [
      {
        name: CONFIGKEYNAME_MYSQL_DATABASE_URL,
        // prisma really wants env values to be in the correct location or in the environment
        // so use this setting to take the value from wherever it is configured and put it into the environment
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
