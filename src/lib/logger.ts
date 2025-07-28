type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: any;
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

    private logToConsole(level: LogLevel, message: string, data?: any): void {
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

    debug(message: string, data?: any, source?: string): void {
        this.logToConsole('debug', message, data);
    }

    info(message: string, data?: any, source?: string): void {
        this.logToConsole('info', message, data);
    }

    warn(message: string, data?: any, source?: string): void {
        this.logToConsole('warn', message, data);
    }

    error(message: string, data?: any, source?: string): void {
        this.logToConsole('error', message, data);
        
        // In production, could send to error reporting service
        if (!this.isDevelopment) {
            // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
        }
    }

    // Specific logging methods for common use cases
    apiError(endpoint: string, error: any): void {
        this.error(`API Error: ${endpoint}`, { error: error.message || error }, 'API');
    }

    userAction(action: string, details?: any): void {
        this.info(`User Action: ${action}`, details, 'USER');
    }

    performance(operation: string, duration: number): void {
        this.debug(`Performance: ${operation} took ${duration}ms`, null, 'PERF');
    }

    firebaseError(operation: string, error: any): void {
        this.error(`Firebase Error: ${operation}`, { error: error.message || error }, 'FIREBASE');
    }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for easier usage
export const { debug, info, warn, error, apiError, userAction, performance, firebaseError } = logger;