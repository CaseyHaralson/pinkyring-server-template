import {Prisma, PrismaClient} from '@prisma/client';
import {IIdempotentRequestRepository} from '@pinkyring/core/interfaces/IBaseParams';

export default class IdempotentRequestRepository
  implements IIdempotentRequestRepository
{
  private _prismaClient;
  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  async createRequest(requestId: string): Promise<boolean> {
    try {
      await this._prismaClient.idempotentRequest.create({
        data: {
          id: requestId,
        },
      });
      return true;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return false;
      }
      throw e;
    }
  }

  async saveRequestResult(requestId: string, result: string): Promise<void> {
    await this._prismaClient.idempotentRequest.update({
      where: {
        id: requestId,
      },
      data: {
        result: result,
      },
    });
  }

  async getRequestResult(
    requestId: string
  ): Promise<string | null | undefined> {
    const result = await this._prismaClient.idempotentRequest.findFirst({
      where: {
        id: requestId,
      },
    });
    return result ? result.result : undefined;
  }

  async deleteRequest(requestId: string): Promise<void> {
    await this._prismaClient.idempotentRequest.delete({
      where: {
        id: requestId,
      },
    });
  }
}
