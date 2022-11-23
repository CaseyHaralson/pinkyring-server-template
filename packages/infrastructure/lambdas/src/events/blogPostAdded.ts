import {SQSEvent} from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
  console.log(`The blog post added event handler has been entered...`);

  const numRecords = event.Records.length;
  console.log(`Received ${numRecords} records`);

  for (const record of event.Records) {
    //
  }
};
