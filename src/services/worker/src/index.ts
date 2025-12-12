// BullMQ Worker Entry Point
import './scoring.worker';

console.log('Worker service started');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Redis: ${process.env.REDIS_URL ? 'connected' : 'using default localhost:6379'}`);

