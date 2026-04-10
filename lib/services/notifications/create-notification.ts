import { NotificationType } from '@/app/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';

export async function createNotification(params: {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
}) {
  const { userId, type, title, message } = params;
  const created = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });

  logger.info('notification.created', {
    notificationId: created.id,
    userId,
    type,
  });

  return created;
}
