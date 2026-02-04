import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPrisma } from '@/lib/prisma';

// Simple in-memory cache for user stats (per-user, 60s TTL)
const statsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const email = (token as any).email as string | undefined;
  const id = ((token as any).id ?? (token as any).sub) as string | undefined;
  const cacheKey = email || id || '';

  // Check cache first
  const cached = statsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ok: true, stats: cached.data });
  }

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
    // ✅ OPTIMIZED: Run queries in parallel instead of sequential
    const [totalTests, allTrials] = await Promise.all([
      prisma.test.count(),
      prisma.trial.findMany({
        where: { student_id: user.user_id },
        select: {
          test_id: true,
          start_time: true,
          end_time: true,
        },
      }),
    ]);

    // Count unique tests completed
    const uniqueTestsCompleted = new Set(allTrials.map(t => t.test_id)).size;

    // Calculate total time spent (in seconds)
    let totalTimeSpent = 0;
    for (const trial of allTrials) {
      if (trial.start_time && trial.end_time) {
        const start = new Date(trial.start_time).getTime();
        const end = new Date(trial.end_time).getTime();
        if (end > start) {
          totalTimeSpent += (end - start) / 1000;
        }
      }
    }

    // ✅ OPTIMIZED: Filter recent trials from allTrials instead of separate query
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentTrials = allTrials.filter(t => new Date(t.start_time) >= sevenDaysAgo);

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

    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const stats = {
      testsCompleted: uniqueTestsCompleted,
      totalTests,
      totalTimeSpent: Math.floor(totalTimeSpent),
      totalTimeFormatted: formatTime(totalTimeSpent),
      frequencyData,
      totalTrials: allTrials.length,
    };

    // ✅ Cache the result
    statsCache.set(cacheKey, { data: stats, timestamp: Date.now() });

    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ ok: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
