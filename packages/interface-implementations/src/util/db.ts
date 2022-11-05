import {PrismaClient} from '@prisma/client';

export const prisma = function () {
  return new PrismaClient({
    log: ['query'],
  });
};
