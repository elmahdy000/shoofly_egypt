import { prisma } from '@/lib/prisma';

export async function getRequestDetails(requestId: number) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      category: true,
      client: { select: { id: true, fullName: true, email: true } },
      images: true,
      bids: {
        select: {
          id: true,
          vendorId: true,
          description: true,
          netPrice: true,
          clientPrice: true,
          status: true,
          vendor: { select: { id: true, fullName: true } },
        },
      },
    },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
}
