import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const where: any = {};

  if (user.role === "CLIENT") where.clientId = user.id;
  else if (user.role === "VENDOR") where.vendorId = user.id;

  const orders = await prisma.order.findMany({
    where,
    include: {
      request: true,
      bid: { include: { vendor: { select: { name: true, phone: true } } } },
      deposit: true,
      delivery: {
        include: { deliveryUser: { select: { name: true, phone: true } } },
      },
      dispute: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
