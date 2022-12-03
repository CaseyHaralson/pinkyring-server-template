import {EventType} from '@pinkyring/core/dtos/events';
// import {BaseLogContext} from '@pinkyring/core/interfaces/ILog';
// import {UnknownPrincipal} from '@pinkyring/core/interfaces/IPrincipal';
import Container from '@pinkyring/di-container/container';

const args = process.argv.slice(2);
//console.log(JSON.stringify(args));

if (args.length == 0) {
  console.log('Not enough arguments...');
  console.log(`Usage: npm run event:produce <message>`);
  process.exitCode = 1;
} else {
  // const blc = {
  //   principal: UnknownPrincipal,
  // } as BaseLogContext;

  const eventHelper = Container.resolveEventHelper();

  const message = args[0];
  console.log(`Publishing test event with message: ${message}`);

  eventHelper.publishEvent({
    eventType: EventType.TEST_EVENT,
    eventData: {
      message: message,
    },
  });
}

// this isn't a valid use-case
// this was just used for testing
// events should come from within the core, not external to it
// what about listening for events?
