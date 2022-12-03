import {BaseEvent} from '../dtos/events';
import IEventRepository from '../interfaces/IEventRepository';
import BaseClass, {IBaseParams} from './baseClass';

export default class EventHelper extends BaseClass {
  private _eventRepository;
  constructor(baseParams: IBaseParams, eventRepository: IEventRepository) {
    super(baseParams, 'EventHelper');
    this._eventRepository = eventRepository;
  }

  async publishEvent(event: BaseEvent): Promise<boolean> {
    try {
      await this._eventRepository.publishEvent(event);
      return true;
    } catch (e) {
      this._logger.error(
        `Error publishing event: ${JSON.stringify(event)} ; error: ${e}`
      );
      return false;
    }
  }

  async createQueue(queueName: string, busName: string, topicPattern: string) {
    await this._eventRepository.createQueue(queueName, busName, topicPattern);
  }

  async listenForEvents(
    queueName: string,
    handlerFunc: (event: BaseEvent) => Promise<boolean>
  ) {
    await this._eventRepository.listenForEvents(queueName, handlerFunc);
  }

  async getEventFromQueue(queueName: string) {
    return await this._eventRepository.getEventFromQueue(queueName);
  }

  async getNumEventsInQueue(queueName: string) {
    return await this._eventRepository.getNumEventsInQueue(queueName);
  }
}
