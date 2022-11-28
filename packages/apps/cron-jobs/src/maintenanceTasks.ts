import container from '@pinkyring/di-container/container';

export async function cleanOldIdempotentRequests() {
  const service = container.resolveMaintenanceService();
  await service.cleanOldIdempotentRequests();
}
