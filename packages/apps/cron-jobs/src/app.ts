import cron from 'node-cron';
import {cleanOldIdempotentRequests} from './maintenanceTasks';

//  ┌────────────── second (optional)
//  │ ┌──────────── minute
//  │ │ ┌────────── hour
//  │ │ │ ┌──────── day of month
//  │ │ │ │ ┌────── month
//  │ │ │ │ │ ┌──── day of week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

// clean old idempotent requests
// runs at 1am every day
cron.schedule('* 1 * * *', async () => {
  await cleanOldIdempotentRequests();
});

// things to run on startup (use timeout to allow for await)
setTimeout(async () => {
  await cleanOldIdempotentRequests();
}, 500);
