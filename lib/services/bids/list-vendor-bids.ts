import { prisma } from '@/lib/prisma';

export async function listVendorBids(vendorId: number) {
  const bids = await prisma.bid.findMany({
    where: { vendorId },
    include: {
      request: {
        select: {
          id: true,
          title: true,
          categoryId: true,
          status: true,
        },
      },
      vendor: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bids;
}
