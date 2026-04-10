import { prisma } from '@/lib/prisma';

export async function listClientRequests(clientId: number) {
  const requests = await prisma.request.findMany({
    where: { clientId },
    include: {
      category: true,
      client: { select: { id: true, fullName: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return requests;
}
