import { prisma } from '@/lib/prisma';
import { CreateRequestInput } from '@/lib/validations/request';
import { logger } from '@/lib/utils/logger';

export async function createRequest(clientId: number, data: CreateRequestInput) {
  logger.info('request.created.started', { clientId, categoryId: data.categoryId });
  const request = await prisma.request.create({
    data: {
      clientId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      deliveryPhone: data.deliveryPhone,
      notes: data.notes || null,
      status: 'PENDING_ADMIN_REVISION',
    },
    include: {
      category: true,
      client: { select: { id: true, fullName: true, email: true } },
    },
  });

  logger.info('request.created.completed', {
    requestId: request.id,
    clientId,
    status: request.status,
  });

  return request;
}
