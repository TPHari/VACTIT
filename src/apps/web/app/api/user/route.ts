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
  return NextResponse.json({
    ok: true,
    user: {
      ...user,
      id: user.user_id,
      avatarUrl: (user as any).avatar_url ?? (user as any).avatarUrl,
    },
  });
}

export async function PATCH(req: NextRequest) {
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

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const data: Record<string, any> = {};
  if (typeof body?.name === 'string' && body.name.trim().length > 0) {
    data.name = body.name.trim();
  }
  if (typeof body?.phone === 'string') {
    const phone = body.phone.trim();
    data.phone = phone.length ? phone : null;
  }
  if (typeof body?.avatarUrl === 'string' && body.avatarUrl.trim().length > 0) {
    data.avatar_url = body.avatarUrl.trim();
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: false, error: 'No changes provided' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { user_id: user.user_id },
    data,
  });

  return NextResponse.json({
    ok: true,
    user: {
      ...updated,
      id: updated.user_id,
      avatarUrl: (updated as any).avatar_url ?? (updated as any).avatarUrl,
    },
  });
}
