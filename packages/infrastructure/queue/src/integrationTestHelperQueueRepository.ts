import {connect} from 'amqplib';
import BaseClass, {IBaseParams} from '@pinkyring/core/util/baseClass';

const CONFIGKEYNAME_RABBITMQ_URL = 'RABBITMQ_URL';

export default class IntegrationTestHelperQueueRepository extends BaseClass {
  constructor(baseParams: IBaseParams) {
    super(baseParams, 'EventRepository', [
      {
        name: CONFIGKEYNAME_RABBITMQ_URL,
      },
    ]);
  }

  async deleteQueue(queueName: string) {
    const connection = await connect(
      this.getConfigValue(CONFIGKEYNAME_RABBITMQ_URL)
    );
    const channel = await connection.createChannel();
    await channel.deleteQueue(queueName);
    await connection.close();
  }
}
