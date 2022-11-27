import cron from 'node-cron';
import container from '@pinkyring/di-container/container';

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
  const service = container.resolveMaintenanceService();
  await service.cleanOldIdempotentRequests();
});
