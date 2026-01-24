/**
 * Structured logging for Worker service (Render-compatible)
 * All logs are JSON-formatted for easy filtering and searching in Render dashboard
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface BaseLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  [key: string]: any;
}

class StructuredLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private serviceName = 'worker' as const;

  private log(level: LogLevel, type: string, message: string, metadata?: Record<string, any>) {
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
  irt(
    jobId: string,
    status: 'queued' | 'processing' | 'completed' | 'failed',
    testId: string,
    duration?: number,
    metadata?: Record<string, any>
  ) {
    this.log(
      status === 'failed' ? 'error' : 'info',
      'irt_processing',
      `IRT Job ${jobId} - ${status}`,
      {
        jobId,
        status,
        testId,
        duration_ms: duration,
        ...metadata,
      }
    );
  }

  // Scoring operations
  scoring(
    jobId: string,
    status: 'queued' | 'processing' | 'completed' | 'failed',
    trialId: string,
    duration?: number,
    metadata?: Record<string, any>
  ) {
    this.log(
      status === 'failed' ? 'error' : 'info',
      'scoring',
      `Scoring Job ${jobId} - ${status}`,
      {
        jobId,
        status,
        trialId,
        duration_ms: duration,
        ...metadata,
      }
    );
  }

  // Performance warnings
  performance(operation: string, duration: number, threshold: number = 5000, metadata?: Record<string, any>) {
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
  error(error: Error | string, context?: Record<string, any>) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    this.log('error', 'error', errorObj.message, {
      error: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      ...context,
    });
  }

  // Generic methods
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

// Export singleton
export const logger = new StructuredLogger();

// Export functions (bind to preserve this context)
export const logIRT = logger.irt.bind(logger);
export const logScoring = logger.scoring.bind(logger);
export const logPerformance = logger.performance.bind(logger);
export const logError = logger.error.bind(logger);
