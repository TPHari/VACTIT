import "dotenv/config";
import server from './server';
import { startIRTScheduler, stopIRTScheduler } from './jobs/irt-scheduler';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`API server running on http://${HOST}:${PORT}`);
    console.log(`Health check: http://${HOST}:${PORT}/health`);
    
    // Start IRT scheduler for automatic exam grading
    startIRTScheduler();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await stopIRTScheduler();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await stopIRTScheduler();
  process.exit(0);
});

start();
