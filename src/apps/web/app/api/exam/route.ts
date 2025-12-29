import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTestId } from '@/lib/generateTestId';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      author_id,
      title,
      type, // 'exam' | 'practice'
      start_time,
      due_time,
      duration,
      url,
      status, // optional
    } = body;

    const test_id = await generateTestId();

    const test = await prisma.test.create({
      data: {
        test_id,
        author_id,
        title,
        type,
        url,
        status: status ?? 'Regular',
        start_time: type === 'exam' ? new Date(start_time) : null,
        due_time: type === 'exam' ? new Date(due_time) : null,
        duration: duration ?? null,
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
     console.error('CREATE TEST ERROR:', error);
  return NextResponse.json(
    { error: (error as Error).message },
    { status: 500 }
  );
  }
}
