import {BaseEvent} from '@pinkyring/core/dtos/events';
import {SQSEvent} from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
  console.log(`The blog post added event handler has been entered...`);

  const numRecords = event.Records.length;
  console.log(`Received ${numRecords} records`);

  for (const record of event.Records) {
    console.log(`Got record: ${record.body}`);

    console.log(`Trying to get event from the record...`);
    const recordBody = JSON.parse(record.body);
    if (recordBody.Message) {
      const message = JSON.parse(recordBody.Message) as BaseEvent;
      console.log(`Parsed event from record: ${message.eventType}`);
      console.log(
        `Parsed event data from record: ${JSON.stringify(message.eventData)}`
      );
      console.log(`...pretending to handle message...`);
    } else {
      console.log(`Couldn't get the event from the record...`);
    }
  }
};
