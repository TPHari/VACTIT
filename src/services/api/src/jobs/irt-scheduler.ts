import cron from 'node-cron';
import { Queue } from 'bullmq';
import { PrismaClient, Prisma } from '@prisma/client';
import IORedis from 'ioredis';
import { logQueue, logError } from '../utils/logger';

let redis: IORedis | null = null;
let prismaInstance: PrismaClient | null = null;

/**
 * Scheduled job to check for exams that reached due_time and trigger IRT calculation
 * Runs every minute with distributed lock to prevent duplicate triggers
 * @param prisma - Shared Prisma client instance from server
 * @param redisClient - Optional shared Redis client (will create if not provided)
 */
export function startIRTScheduler(prisma: PrismaClient, redisClient?: IORedis) {
  // Store shared instances
  prismaInstance = prisma;
  redis = redisClient || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
  
  // Run every minute: '* * * * *'
  // Or every 5 minutes: '*/5 * * * *'
  const schedule = process.env.IRT_SCHEDULER_CRON || '* * * * *';
  
  console.log(` Starting IRT scheduler (${schedule})...`);

  cron.schedule(schedule, async () => {
    const lockKey = 'irt-scheduler:lock';
    const lockTTL = 55; // Lock expires in 55 seconds (before next run)
    
    try {
      // Try to acquire distributed lock (only one instance will succeed)
      const acquired = await redis.set(lockKey, Date.now().toString(), 'EX', lockTTL, 'NX');
      
      if (!acquired) {
        // Another instance is already processing
        return;
      }
      
      console.log('🔒 Acquired scheduler lock, checking for exams...');
      
      // Use UTC time to match database timezone (Supabase stores in UTC)
      const now = new Date();
      console.log('[Scheduler] Current time:', {
        local: now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
        utc: now.toISOString(),
        timestamp: now.getTime()
      });
      
      if (!prismaInstance) {
        throw new Error('Prisma instance not initialized');
      }
      
      // Find all exams that:
      // 1. type = 'exam'
      // 2. due_time has passed
      // 3. Has at least one trial with processed_score = null (IRT not calculated yet)
      const examsNeedingIRT = await prismaInstance.test.findMany({
        where: {
          type: 'exam',
          due_time: {
            lte: now, // due_time <= now
          },
          trials: {
            some: {
              processed_score: { equals: Prisma.JsonNull }, // Has trials without IRT scores (JSON null)
            },
          },
        },
        include: {
          trials: {
            where: {
              processed_score: { equals: Prisma.JsonNull },
            },
            select: {
              trial_id: true,
            },
          },
        },
      });

      if (examsNeedingIRT.length === 0) {
        return; // No exams need IRT calculation
      }

      console.log(`🔍 Found ${examsNeedingIRT.length} exam(s) past due time, checking for IRT results...`);

      const irtQueue = new Queue('irt-queue', {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      });

      for (const exam of examsNeedingIRT) {
        // Trigger IRT calculation for this exam
        await irtQueue.add('calculate', { testId: exam.test_id });

        logQueue('irt-queue', 'add', undefined, {
          testId: exam.test_id,
          title: exam.title,
          dueTime: exam.due_time,
          trialsCount: exam.trials.length,
          trigger: 'scheduled_auto',
        });

        console.log(`✅ Triggered IRT for exam: ${exam.test_id} (${exam.title}) - ${exam.trials.length} trial(s) pending - Due: ${exam.due_time}`);
      }

      await irtQueue.close();
    } catch (error) {
      console.error(' IRT Scheduler error:', error);
      logError(error as Error, {
        context: 'irt_scheduler',
      });    } finally {
      // Always release lock (even on error)
      try {
        await redis.del(lockKey);
      } catch (unlockError) {
        console.error('Failed to release scheduler lock:', unlockError);
      }    }
  });

  console.log(' IRT scheduler started successfully');
}

/**
 * Graceful shutdown handler
 */
export async function stopIRTScheduler() {
  // Only disconnect Redis if we created it locally (not shared)
  if (redis) {
    await redis.quit();
  }
  console.log('⏹  IRT scheduler stopped');
}
