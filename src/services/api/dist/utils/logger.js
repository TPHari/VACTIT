"use strict";
/**
 * Structured logging for API service (Render-compatible)
 * All logs are JSON-formatted for easy filtering and searching in Render dashboard
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logQueue = exports.logMetric = exports.logError = exports.logPerformance = exports.logExternalApi = exports.logDb = exports.logExam = exports.logAuth = exports.logRequest = exports.logger = void 0;
class StructuredLogger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.serviceName = 'api';
    }
    log(level, type, message, metadata) {
        // Skip debug logs in production
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
        // Render captures these automatically
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
    // HTTP Request logging
    request(method, url, statusCode, duration, userId, metadata) {
        this.log('info', 'http_request', `${method} ${url} - ${statusCode}`, {
            method,
            url,
            statusCode,
            duration_ms: duration,
            userId,
            ...metadata,
        });
    }
    // Authentication events
    auth(event, userId, success, metadata) {
        this.log(success ? 'info' : 'warn', 'auth', `${event} - ${success ? 'SUCCESS' : 'FAILED'}`, {
            event,
            userId,
            success,
            ...metadata,
        });
    }
    // Exam/Test events
    exam(event, testId, userId, metadata) {
        this.log('info', 'exam', `Exam ${event}: ${testId}`, {
            event,
            testId,
            userId,
            ...metadata,
        });
    }
    // Database operations
    db(operation, table, duration, success = true, metadata) {
        this.log(success ? 'debug' : 'error', 'database', `${operation} ${table}`, {
            operation,
            table,
            duration_ms: duration,
            success,
            ...metadata,
        });
    }
    // External API calls
    externalApi(service, endpoint, statusCode, duration, metadata) {
        this.log('info', 'external_api', `${service} ${endpoint}`, {
            service,
            endpoint,
            statusCode,
            duration_ms: duration,
            ...metadata,
        });
    }
    // Performance warnings
    performance(operation, duration, threshold = 1000, metadata) {
        if (duration > threshold) {
            this.log('warn', 'performance', `Slow operation: ${operation}`, {
                operation,
                duration_ms: duration,
                threshold_ms: threshold,
                ...metadata,
            });
        }
    }
    // Error logging with full context
    error(error, context) {
        const errorObj = typeof error === 'string' ? new Error(error) : error;
        this.log('error', 'error', errorObj.message, {
            error: errorObj.name,
            message: errorObj.message,
            stack: errorObj.stack,
            ...context,
        });
    }
    // Business metrics/events
    metric(metric, value, unit, metadata) {
        this.log('info', 'metric', `${metric}: ${value}${unit ? ` ${unit}` : ''}`, {
            metric,
            value,
            unit,
            ...metadata,
        });
    }
    // Queue operations
    queue(queue, operation, jobId, metadata) {
        this.log('info', 'queue', `Queue ${queue} - ${operation}`, {
            queue,
            operation,
            jobId,
            ...metadata,
        });
    }
    // Generic info/warn/error/debug
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
// Export singleton instance
exports.logger = new StructuredLogger();
// Export individual functions for convenience (bind to preserve 'this' context)
exports.logRequest = exports.logger.request.bind(exports.logger);
exports.logAuth = exports.logger.auth.bind(exports.logger);
exports.logExam = exports.logger.exam.bind(exports.logger);
exports.logDb = exports.logger.db.bind(exports.logger);
exports.logExternalApi = exports.logger.externalApi.bind(exports.logger);
exports.logPerformance = exports.logger.performance.bind(exports.logger);
exports.logError = exports.logger.error.bind(exports.logger);
exports.logMetric = exports.logger.metric.bind(exports.logger);
exports.logQueue = exports.logger.queue.bind(exports.logger);
