"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// BullMQ Worker Entry Point
require("dotenv/config");
require("./scoring.worker");
require("./irt.worker");
console.log('Worker service started');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Redis: ${process.env.REDIS_URL ? 'connected' : 'using default localhost:6379'}`);
