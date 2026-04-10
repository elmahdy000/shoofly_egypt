import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireUser, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);
    requireRole(user, 'VENDOR');

    // Get all open requests for vendors to bid on
    const requests = await prisma.request.findMany({
      where: {
        status: {
          in: ['OPEN_FOR_BIDDING', 'BIDS_RECEIVED'],
        },
      },
      include: {
        category: true,
        client: { select: { id: true, fullName: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 400 }
    );
  }
}


