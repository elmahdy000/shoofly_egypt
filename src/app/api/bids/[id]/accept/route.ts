import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (user.role !== "CLIENT")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const bid = await prisma.bid.findUnique({
    where: { id: params.id },
    include: { request: true },
  });

  if (!bid)
    return NextResponse.json({ error: "Bid not found" }, { status: 404 });
  if (bid.request.clientId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Determine if deposit is needed (price > 500 = high value)
  const depositRequired = bid.price > 500;
  const depositAmount = depositRequired ? Math.round(bid.price * 0.2) : null;

  // Accept bid, reject others
  await prisma.bid.update({
    where: { id: bid.id },
    data: { status: "ACCEPTED" },
  });
  await prisma.bid.updateMany({
    where: { requestId: bid.requestId, id: { not: bid.id } },
    data: { status: "REJECTED" },
  });

  // Close request
  await prisma.request.update({
    where: { id: bid.requestId },
    data: { status: "CLOSED" },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      requestId: bid.requestId,
      bidId: bid.id,
      clientId: user.id,
      vendorId: bid.vendorId,
      totalPrice: bid.price,
      depositRequired,
      depositAmount,
      status: depositRequired ? "PENDING_DEPOSIT" : "CONFIRMED",
    },
  });

  // Create delivery record
  await prisma.delivery.create({
    data: { orderId: order.id, status: "AVAILABLE" },
  });

  return NextResponse.json(order, { status: 201 });
}
