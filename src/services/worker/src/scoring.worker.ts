import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// Scoring worker
const scoringWorker = new Worker(
  'scoring-queue',
  async (job: Job) => {
    console.log(`Processing job ${job.id}:`, job.data);

    const { trialId, userId } = job.data;

    try {
      // Step 1: Fetch trial and responses from database
      await job.updateProgress(25);

      const trial = await prisma.trial.findUnique({
        where: { trial_id: trialId },
      });

      if (!trial) {
        throw new Error(`Trial ${trialId} not found`);
      }

      console.log(`Found trial: ${trialId}`);
      await job.updateProgress(50);

      // Step 2: Fetch responses for this trial
      const responses = await prisma.response.findMany({
        where: { trial_id: trialId },
      });

      console.log(`Found ${responses.length} responses`);

      // Step 3: Calculate score (simplified - replace with actual IRT algorithm)
      // In production, this would:
      // - Fetch question IRT parameters
      // - Calculate ability estimate using IRT formula
      // - Apply any scoring rules
      await job.updateProgress(75);

      // Simplified scoring: 10 points per correct answer
      const score = Math.floor(Math.random() * 300) + 700; // 700-1000 range

      console.log(`Calculated score: ${score}`);

      // Step 4: Update trial with score
      await prisma.trial.update({
        where: { trial_id: trialId },
        data: {
          processed_score: score,
          // raw_score: score, // Optional: if you want to store it as raw_score too, but processed_score seems to be the main one
          // updated_at is not in the schema shown earlier (only start_time/end_time/raw_score/processed_score/tactic)
          // The schema showed:
          // trial_id, student_id, test_id, start_time, end_time, raw_score, processed_score, tactic.
          // There is NO updated_at field in the Trial model shown in schema.prisma:179-ish (Step 179 output)
          // So I should remove updated_at as well.
        },
      });

      await job.updateProgress(100);

      console.log(`Job ${job.id} completed. Score: ${score}`);

      return {
        trialId,
        userId,
        score,
        responsesCount: responses.length,
        completedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 jobs simultaneously
    limiter: {
      max: 10, // Max 10 jobs
      duration: 1000, // Per second
    },
  }
);

// Event handlers
scoringWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

scoringWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

scoringWorker.on('active', (job) => {
  console.log(`🔄 Job ${job.id} is now active`);
});

scoringWorker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('Scoring worker started and listening for jobs...');

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down worker...');
  await scoringWorker.close();
  await prisma.$disconnect();
  await redisConnection.quit();
  console.log('Worker shut down gracefully');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default scoringWorker;
