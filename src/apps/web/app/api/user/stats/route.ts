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

  try {
    // Get total number of tests
    const totalTests = await prisma.test.count();

    // Get number of tests the user has completed (at least one trial)
    const completedTrials = await prisma.trial.findMany({
      where: { student_id: user.user_id },
      select: {
        test_id: true,
        start_time: true,
        end_time: true,
      },
    });

    // Count unique tests completed
    const uniqueTestsCompleted = new Set(completedTrials.map(t => t.test_id)).size;

    // Calculate total time spent (in seconds) - sum of all (end_time - start_time) for each trial
    let totalTimeSpent = 0;
    for (const trial of completedTrials) {
      if (trial.start_time && trial.end_time) {
        const start = new Date(trial.start_time).getTime();
        const end = new Date(trial.end_time).getTime();
        // Only add if end > start (valid duration)
        if (end > start) {
          totalTimeSpent += (end - start) / 1000; // Convert ms to seconds
        }
      }
    }

    // Get frequency data for last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentTrials = await prisma.trial.findMany({
      where: {
        student_id: user.user_id,
        start_time: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        start_time: true,
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    // Build frequency map for each of the last 7 days
    const frequencyData: { date: string; count: number; dayLabel: string }[] = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = dayNames[date.getDay()];
      
      const count = recentTrials.filter(trial => {
        const trialDate = new Date(trial.start_time).toISOString().split('T')[0];
        return trialDate === dateStr;
      }).length;

      frequencyData.push({ date: dateStr, count, dayLabel });
    }

    // Format time as "HH:MM" or "MM:SS"
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return NextResponse.json({
      ok: true,
      stats: {
        testsCompleted: uniqueTestsCompleted,
        totalTests,
        totalTimeSpent: Math.floor(totalTimeSpent),
        totalTimeFormatted: formatTime(totalTimeSpent),
        frequencyData,
        totalTrials: completedTrials.length,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ ok: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
