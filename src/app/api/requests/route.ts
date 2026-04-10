import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: any = {};

  if (user.role === "CLIENT") {
    where.clientId = user.id;
  } else if (user.role === "VENDOR") {
    where.status = status || "OPEN";
  } else if (user.role === "ADMIN") {
    if (status) where.status = status;
  }

  const requests = await prisma.request.findMany({
    where,
    include: {
      client: { select: { name: true, phone: true } },
      bids: {
        include: { vendor: { select: { name: true } } },
      },
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (user.role !== "CLIENT")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, imageUrl, location, phone } = await req.json();

  const request = await prisma.request.create({
    data: {
      clientId: user.id,
      title,
      description,
      imageUrl,
      location,
      phone,
      status: "OPEN",
    },
  });

  return NextResponse.json(request, { status: 201 });
}
