import {PrismaClient} from '@prisma/client';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';

export default class PrismaClientFactory extends BaseClass {
  constructor(baseParams: IBaseParams) {
    super(baseParams, '', [
      {
        name: 'DATABASE_URL',
        loadIntoEnv: true,
      },
    ]);
  }

  createPrismaClient() {
    return new PrismaClient({
      log: ['query'],
    });
  }
}
