import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  let where: any = {};

  if (user.role === "DELIVERY") {
    where = {
      OR: [
        { deliveryUserId: user.id },
        { status: "AVAILABLE", deliveryUserId: null },
      ],
    };
  }

  const tasks = await prisma.delivery.findMany({
    where,
    include: {
      order: {
        include: {
          request: { select: { title: true, location: true, phone: true } },
          bid: { include: { vendor: { select: { name: true, phone: true } } } },
        },
      },
      deliveryUser: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}
