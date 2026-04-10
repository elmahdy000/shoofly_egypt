import { NextRequest } from 'next/server';
import { getCurrentUser, requireRole, requireUser } from '@/lib/auth';
import { listAdminUsers } from '@/lib/services/admin';
import { fail, ok } from '@/lib/utils/http-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);
    requireRole(user, 'ADMIN');

    const users = await listAdminUsers();
    return ok(users);
  } catch (error) {
    return fail(error);
  }
}
