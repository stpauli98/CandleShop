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

class Logger {
    private isDevelopment = import.meta.env.DEV;
    private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'error';

    private formatMessage(level: LogLevel, message: string, _source?: string): string {
        const timestamp = new Date().toISOString();
        const prefix = _source ? `[${_source}]` : '';
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

    debug(message: string, data?: LogData, _source?: string): void {
        this.logToConsole('debug', message, data);
    }

    info(message: string, data?: LogData, _source?: string): void {
        this.logToConsole('info', message, data);
    }

    warn(message: string, data?: LogData, _source?: string): void {
        this.logToConsole('warn', message, data);
    }

    error(message: string, data?: LogData, _source?: string): void {
        this.logToConsole('error', message, data);

        // In production, integrate with error reporting service
        if (!this.isDevelopment) {
            // Future: Integrate with Sentry, LogRocket, or similar service
        }
    }

    performance(operation: string, duration: number): void {
        this.logToConsole('info', `Performance: ${operation}`, { duration: `${duration}ms` });
    }

    firebaseError(operation: string, err: unknown): void {
        const error = err as { code?: string; message?: string };
        this.logToConsole('error', `Firebase error during ${operation}`, {
            error: error.message || String(err),
            code: error.code,
            operation
        });
    }
}

// Export singleton instance
const logger = new Logger();

// Export bound methods to preserve 'this' context
export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);
export const performance = logger.performance.bind(logger);
export const firebaseError = logger.firebaseError.bind(logger);

export default logger;
