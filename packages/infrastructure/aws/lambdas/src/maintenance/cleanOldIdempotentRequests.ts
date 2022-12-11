import container from '@pinkyring/di-container/container';

const service = container.resolveMaintenanceService();
const principal = container
  .resolvePrincipalResolver()
  .resolveMachinePrincipal('AWS Clean Old Idempotent Requests Handler');

export const handler = async () => {
  await service.cleanOldIdempotentRequests(principal);
};
