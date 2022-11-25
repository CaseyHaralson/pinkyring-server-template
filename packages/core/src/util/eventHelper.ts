import {BaseEvent} from '../dtos/events';
import IEventRepository from '../interfaces/IEventRepository';
import {BaseLogContext, ILoggableClass, LogContext} from '../interfaces/ILog';
import Logger from './logger';

export default class EventHelper implements ILoggableClass {
  private _logger;
  private _eventRepository;
  constructor(logger: Logger, eventRepository: IEventRepository) {
    this._logger = logger;
    this._eventRepository = eventRepository;
  }

  className(): string {
    return 'EventHelper';
  }

  async publishEvent(blc: BaseLogContext, event: BaseEvent): Promise<boolean> {
    try {
      await this._eventRepository.publishEvent(event);
      return true;
    } catch (e) {
      const lc = {
        ...blc,
        currentObj: this,
        methodName: 'publishEvent',
      } as LogContext;
      this._logger.error(
        lc,
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
