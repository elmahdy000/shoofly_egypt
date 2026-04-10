import { prisma } from '@/lib/prisma';

export async function listUserNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}
