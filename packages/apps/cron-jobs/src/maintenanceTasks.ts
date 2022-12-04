import container from '@pinkyring/di-container/container';

export async function cleanOldIdempotentRequests() {
  const service = container.resolveMaintenanceService();
  const principal = container
    .resolvePrincipalResolver()
    .resolveMachinePrincipal('cron job');
  await service.cleanOldIdempotentRequests(principal);
}
