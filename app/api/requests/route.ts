import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireUser, requireRole } from '@/lib/auth';
import { CreateRequestSchema } from '@/lib/validations/request';
import { createRequest, listClientRequests } from '@/lib/services/requests';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);
    requireRole(user, 'CLIENT');

    const body = await req.json();
    const validated = CreateRequestSchema.parse(body);

    const request = await createRequest(user.id, validated);
    return NextResponse.json(request, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);
    requireRole(user, 'CLIENT');

    const requests = await listClientRequests(user.id);
    return NextResponse.json(requests);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 400 }
    );
  }
}


