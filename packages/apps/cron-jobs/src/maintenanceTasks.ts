import container from '@pinkyring/di-container/container';

export async function cleanOldIdempotentRequests() {
  console.log('entering the idempotent request cleanup job');
  console.log('resolving the needed service and calling the cleanup function');
  const service = container.resolveMaintenanceService();
  const principal = container
    .resolvePrincipalResolver()
    .resolveMachinePrincipal('cron job');
  await service.cleanOldIdempotentRequests(principal);
}
