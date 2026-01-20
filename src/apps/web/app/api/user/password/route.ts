import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPrisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const currentPassword = body?.currentPassword as string | undefined;
  const newPassword = body?.newPassword as string | undefined;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ ok: false, error: 'Missing password fields' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
  }

  const email = (token as any).email as string | undefined;
  const id = ((token as any).id ?? (token as any).sub) as string | undefined;
  const prisma = await getPrisma();
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : id
      ? await prisma.user.findUnique({ where: { user_id: id } })
      : null;

  if (!user || !(user as any).hash_password) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, (user as any).hash_password);
  if (!isValid) {
    return NextResponse.json({ ok: false, error: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { user_id: (user as any).user_id },
    data: { hash_password: hashed },
  });

  return NextResponse.json({ ok: true });
}
