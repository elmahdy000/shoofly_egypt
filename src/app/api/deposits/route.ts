import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const { orderId, amount, method, proofUrl } = await req.json();

  const deposit = await prisma.deposit.create({
    data: {
      orderId,
      clientId: user.id,
      amount,
      method,
      proofUrl,
      status: "PENDING",
    },
  });

  return NextResponse.json(deposit, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const where = user.role === "ADMIN" ? {} : { clientId: user.id };

  const deposits = await prisma.deposit.findMany({
    where,
    include: {
      order: { include: { request: true } },
      client: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(deposits);
}
