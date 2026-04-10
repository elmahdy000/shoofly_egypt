import { prisma } from '@/lib/prisma';

export async function listAdminUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      walletBalance: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' },
  });
}
