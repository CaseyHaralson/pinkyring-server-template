import {BaseEvent} from '../dtos/events';
import IEventRepository from '../interfaces/IEventRepository';

export default class EventHelper {
  private _eventRepository;
  constructor(eventRepository: IEventRepository) {
    this._eventRepository = eventRepository;
  }

  async publishEvent(event: BaseEvent) {
    await this._eventRepository.publishEvent(event);
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

  async getEventCount(queueName: string) {
    return await this._eventRepository.getEventCount(queueName);
  }
}

// aws
// repo
// some way to push events onto SNS
// lambda
// handle SNS event triggers
// push events on to SQS
// handle SQS events
