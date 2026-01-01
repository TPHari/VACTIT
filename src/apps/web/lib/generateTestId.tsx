// lib/generateTestId.ts
import { getPrisma } from './prisma';

export async function generateTestId(): Promise<string> {
  const prisma = await getPrisma();
  const lastTest = await prisma.test.findFirst({
    orderBy: { test_id: 'desc' },
    select: { test_id: true },
  });

  const nextNumber = lastTest
    ? parseInt(lastTest.test_id, 10) + 1
    : 1;

  return nextNumber.toString().padStart(5, '0'); // 00001
}
