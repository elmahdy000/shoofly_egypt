import { NextRequest } from 'next/server';
import { getCurrentUser, requireUser } from '@/lib/auth';
import { listUserNotifications } from '@/lib/services/notifications';
import { fail, ok } from '@/lib/utils/http-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req.headers);
    requireUser(user);
    const notifications = await listUserNotifications(user.id);
    return ok(notifications);
  } catch (error) {
    return fail(error);
  }
}
