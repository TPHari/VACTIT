"use strict";
/**
 * Structured logging for Worker service (Render-compatible)
 * All logs are JSON-formatted for easy filtering and searching in Render dashboard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logPerformance = exports.logScoring = exports.logIRT = exports.logger = void 0;
class StructuredLogger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.serviceName = 'worker';
    }
    log(level, type, message, metadata) {
        if (!this.isDevelopment && level === 'debug')
            return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            service: this.serviceName,
            environment: process.env.NODE_ENV || 'development',
            type,
            message,
            ...metadata,
        };
        const logString = JSON.stringify(entry);
        switch (level) {
            case 'error':
                console.error(logString);
                break;
            case 'warn':
                console.warn(logString);
                break;
            default:
                console.log(logString);
        }
    }
    // IRT Processing
    irt(jobId, status, testId, duration, metadata) {
        this.log(status === 'failed' ? 'error' : 'info', 'irt_processing', `IRT Job ${jobId} - ${status}`, {
            jobId,
            status,
            testId,
            duration_ms: duration,
            ...metadata,
        });
    }
    // Scoring operations
    scoring(jobId, status, trialId, duration, metadata) {
        this.log(status === 'failed' ? 'error' : 'info', 'scoring', `Scoring Job ${jobId} - ${status}`, {
            jobId,
            status,
            trialId,
            duration_ms: duration,
            ...metadata,
        });
    }
    // Performance warnings
    performance(operation, duration, threshold = 5000, metadata) {
        if (duration > threshold) {
            this.log('warn', 'performance', `Slow operation: ${operation}`, {
                operation,
                duration_ms: duration,
                threshold_ms: threshold,
                ...metadata,
            });
        }
    }
    // Error logging
    error(error, context) {
        const errorObj = typeof error === 'string' ? new Error(error) : error;
        this.log('error', 'error', errorObj.message, {
            error: errorObj.name,
            message: errorObj.message,
            stack: errorObj.stack,
            ...context,
        });
    }
    // Generic methods
    info(message, metadata) {
        this.log('info', 'general', message, metadata);
    }
    warn(message, metadata) {
        this.log('warn', 'general', message, metadata);
    }
    debug(message, metadata) {
        this.log('debug', 'general', message, metadata);
    }
}
// Export singleton
exports.logger = new StructuredLogger();
// Export functions (bind to preserve this context)
exports.logIRT = exports.logger.irt.bind(exports.logger);
exports.logScoring = exports.logger.scoring.bind(exports.logger);
exports.logPerformance = exports.logger.performance.bind(exports.logger);
exports.logError = exports.logger.error.bind(exports.logger);
