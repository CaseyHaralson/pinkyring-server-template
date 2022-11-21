import {BaseEvent} from '../dtos/events';
import IEventRepository from '../interfaces/IEventRepository';

export default class EventHelper {
  private _eventRepository;
  constructor(eventRepository: IEventRepository) {
    this._eventRepository = eventRepository;
  }

  async publishEvent(event: BaseEvent) {
    console.log(`Event type: ${event.eventType}`);
    await this._eventRepository.publishEvent(event);
  }
}

// IEventRepository
// publishEvent

// listenForEvents

// setup queue

//

// aws
// repo
// some way to push events onto SNS
// lambda
// handle SNS event triggers
// push events on to SQS
// handle SQS events
