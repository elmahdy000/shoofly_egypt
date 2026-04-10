import { prisma } from '@/lib/prisma';

export async function listAdminTransactions() {
  return prisma.transaction.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
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
