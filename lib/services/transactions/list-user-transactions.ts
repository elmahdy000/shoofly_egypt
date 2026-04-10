import { prisma } from '@/lib/prisma';

export async function listUserTransactions(userId: number) {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      request: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}
