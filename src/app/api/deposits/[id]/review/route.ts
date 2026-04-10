import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status, adminNote } = await req.json();

  const deposit = await prisma.deposit.update({
    where: { id: params.id },
    data: { status, adminNote },
  });

  // If approved, confirm the order
  if (status === "APPROVED") {
    await prisma.order.update({
      where: { id: deposit.orderId },
      data: { status: "CONFIRMED" },
    });
  }

  return NextResponse.json(deposit);
}
