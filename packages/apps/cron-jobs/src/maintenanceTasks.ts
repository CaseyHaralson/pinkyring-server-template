import container from '@pinkyring/di-container/container';

export async function cleanOldIdempotentRequests() {
  const service = container.resolveMaintenanceService();
  const principal = container
    .resolvePrincipalResolver()
    .resolveMachineAccount('cron job');
  await service.cleanOldIdempotentRequests(principal);
}
