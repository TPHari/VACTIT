import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPrisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const email = (token as any).email as string | undefined;
  const id = ((token as any).id ?? (token as any).sub) as string | undefined;
  const prisma = await getPrisma();
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : id
      ? await prisma.user.findUnique({ where: { user_id: id } })
      : null;
  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, user });
}
