import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/validations/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions as any);
  if (session) {
    redirect('/overview');
  }
  redirect('/auth/login');
}