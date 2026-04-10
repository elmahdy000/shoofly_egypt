import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const request = await prisma.request.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { name: true, phone: true, email: true } },
      bids: {
        include: { vendor: { select: { id: true, name: true, phone: true } } },
        orderBy: { price: "asc" },
      },
      order: { include: { delivery: true, deposit: true } },
    },
  });

  if (!request)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(request);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  const updated = await prisma.request.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(updated);
}
