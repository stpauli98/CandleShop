type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Specific interfaces for different types of data
interface ErrorData {
    error?: string | Error;
    stack?: string;
    code?: string;
    [key: string]: unknown;
}

interface PerformanceData {
    duration?: number;
    operation?: string;
    [key: string]: unknown;
}

interface UserActionData {
    userId?: string;
    action?: string;
    timestamp?: number;
    [key: string]: unknown;
}

interface FirebaseData {
    operation?: string;
    error?: string | Error;
    code?: string;
    [key: string]: unknown;
}

// Union type for all possible data types
type LogData = ErrorData | PerformanceData | UserActionData | FirebaseData | Record<string, unknown> | null | undefined;

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: LogData;
    timestamp: string;
    source?: string;
}

class Logger {
    private isDevelopment = import.meta.env.DEV;
    private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'error';

    private formatMessage(level: LogLevel, message: string, source?: string): string {
        const timestamp = new Date().toISOString();
        const prefix = source ? `[${source}]` : '';
        return `[${timestamp}] ${level.toUpperCase()} ${prefix} ${message}`;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        return levels[level] >= levels[this.logLevel];
    }

    private logToConsole(level: LogLevel, message: string, data?: LogData): void {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message);
        
        switch (level) {
            case 'debug':
                console.debug(formattedMessage, data || '');
                break;
            case 'info':
                console.info(formattedMessage, data || '');
                break;
            case 'warn':
                console.warn(formattedMessage, data || '');
                break;
            case 'error':
                console.error(formattedMessage, data || '');
                break;
        }
    }

    debug(message: string, data?: LogData, source?: string): void {
        this.logToConsole('debug', message, data);
    }

    info(message: string, data?: LogData, source?: string): void {
        this.logToConsole('info', message, data);
    }

    warn(message: string, data?: LogData, source?: string): void {
        this.logToConsole('warn', message, data);
    }

    error(message: string, data?: LogData, source?: string): void {
        this.logToConsole('error', message, data);
        
        // In production, integrate with error reporting service
        if (!this.isDevelopment) {
            // Future: Integrate with Sentry, LogRocket, or similar service
            // this.sendToErrorReportingService(message, data);
        }
    }

    // Specific logging methods for common use cases
    apiError(endpoint: string, error: Error | string): void {
        const errorData: ErrorData = { 
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        };
        this.error(`API Error: ${endpoint}`, errorData, 'API');
    }

    userAction(action: string, details?: UserActionData): void {
        this.info(`User Action: ${action}`, details, 'USER');
    }

    performance(operation: string, duration: number): void {
        const perfData: PerformanceData = { 
            operation, 
            duration 
        };
        this.debug(`Performance: ${operation} took ${duration}ms`, perfData, 'PERF');
    }

    firebaseError(operation: string, error: Error | string): void {
        const firebaseData: FirebaseData = { 
            operation,
            error: error instanceof Error ? error.message : error,
            code: error instanceof Error ? (error as any).code : undefined
        };
        this.error(`Firebase Error: ${operation}`, firebaseData, 'FIREBASE');
    }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for easier usage
export const { debug, info, warn, error, apiError, userAction, performance, firebaseError } = logger;