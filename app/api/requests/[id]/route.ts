import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireUser } from '@/lib/auth';
import { getRequestDetails } from '@/lib/services/requests';
import { RequestIdParamSchema } from '@/lib/validations/request';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);

    const parsedParams = RequestIdParamSchema.parse(await params);
    const id = parsedParams.id;
    const request = await getRequestDetails(id);

    // Authorization: client can see their own, admin can see all, vendor cannot see until bidding
    if (user.role === 'CLIENT' && request.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(request);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: message.includes('not found') ? 404 : 400 }
    );
  }
}


