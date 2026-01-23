/**
 * Structured logging for API service (Render-compatible)
 * All logs are JSON-formatted for easy filtering and searching in Render dashboard
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface BaseLogEntry {
  timestamp: string;
  level: LogLevel;
  service: 'api';
  environment: string;
  [key: string]: any;
}

class StructuredLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private serviceName = 'api';

  private log(level: LogLevel, type: string, message: string, metadata?: Record<string, any>) {
    // Skip debug logs in production
    if (!this.isDevelopment && level === 'debug') return;

    const entry: BaseLogEntry = {
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
  request(method: string, url: string, statusCode: number, duration: number, userId?: string, metadata?: Record<string, any>) {
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
  auth(event: 'login' | 'signup' | 'logout' | 'oauth' | 'token_refresh', userId: string, success: boolean, metadata?: Record<string, any>) {
    this.log(
      success ? 'info' : 'warn',
      'auth',
      `${event} - ${success ? 'SUCCESS' : 'FAILED'}`,
      {
        event,
        userId,
        success,
        ...metadata,
      }
    );
  }

  // Exam/Test events
  exam(event: 'start' | 'submit' | 'view' | 'create', testId: string, userId: string, metadata?: Record<string, any>) {
    this.log('info', 'exam', `Exam ${event}: ${testId}`, {
      event,
      testId,
      userId,
      ...metadata,
    });
  }

  // Database operations
  db(operation: string, table: string, duration: number, success: boolean = true, metadata?: Record<string, any>) {
    this.log(
      success ? 'debug' : 'error',
      'database',
      `${operation} ${table}`,
      {
        operation,
        table,
        duration_ms: duration,
        success,
        ...metadata,
      }
    );
  }

  // External API calls
  externalApi(service: string, endpoint: string, statusCode: number, duration: number, metadata?: Record<string, any>) {
    this.log('info', 'external_api', `${service} ${endpoint}`, {
      service,
      endpoint,
      statusCode,
      duration_ms: duration,
      ...metadata,
    });
  }

  // Performance warnings
  performance(operation: string, duration: number, threshold: number = 1000, metadata?: Record<string, any>) {
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
  error(error: Error | string, context?: Record<string, any>) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    this.log('error', 'error', errorObj.message, {
      error: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      ...context,
    });
  }

  // Business metrics/events
  metric(metric: string, value: number, unit?: string, metadata?: Record<string, any>) {
    this.log('info', 'metric', `${metric}: ${value}${unit ? ` ${unit}` : ''}`, {
      metric,
      value,
      unit,
      ...metadata,
    });
  }

  // Queue operations
  queue(queue: string, operation: 'add' | 'process' | 'complete' | 'fail', jobId?: string, metadata?: Record<string, any>) {
    this.log('info', 'queue', `Queue ${queue} - ${operation}`, {
      queue,
      operation,
      jobId,
      ...metadata,
    });
  }

  // Generic info/warn/error/debug
  info(message: string, metadata?: Record<string, any>) {
    this.log('info', 'general', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', 'general', message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', 'general', message, metadata);
  }
}

// Export singleton instance
export const logger = new StructuredLogger();

// Export individual functions for convenience
export const {
  request: logRequest,
  auth: logAuth,
  exam: logExam,
  db: logDb,
  externalApi: logExternalApi,
  performance: logPerformance,
  error: logError,
  metric: logMetric,
  queue: logQueue,
} = logger;
