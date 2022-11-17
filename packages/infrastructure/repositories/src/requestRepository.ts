import {Prisma, PrismaClient} from '@prisma/client';
import {IRequestRepository} from '@pinkyring/core/interfaces/IBaseParams';

export default class RequestRepository implements IRequestRepository {
  private _prismaClient;
  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  async createRequest(requestId: string): Promise<boolean> {
    try {
      await this._prismaClient.request.create({
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
    await this._prismaClient.request.update({
      where: {
        id: requestId,
      },
      data: {
        result: result,
      },
    });
  }

  async getRequestResult(requestId: string): Promise<string | null> {
    const result = await this._prismaClient.request.findFirst({
      where: {
        id: requestId,
      },
    });
    return result ? result.result : null;
  }
}
