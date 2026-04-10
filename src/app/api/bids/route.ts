import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (user.role !== "VENDOR")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { requestId, price, deliveryTime, notes } = await req.json();

  // Check if vendor already bid on this request
  const existing = await prisma.bid.findFirst({
    where: { requestId, vendorId: user.id },
  });
  if (existing)
    return NextResponse.json(
      { error: "Already submitted a bid" },
      { status: 400 },
    );

  const bid = await prisma.bid.create({
    data: { requestId, vendorId: user.id, price, deliveryTime, notes },
  });

  // Update request status to HAS_BIDS
  await prisma.request.update({
    where: { id: requestId },
    data: { status: "HAS_BIDS" },
  });

  return NextResponse.json(bid, { status: 201 });
}
