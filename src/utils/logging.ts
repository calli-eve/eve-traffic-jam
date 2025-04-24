import winston from 'winston';

interface UsageLog {
    timestamp: string;
    event: 'login' | 'path_calculation';
    characterId: string;
    characterName: string;
    corporationId?: number;
    additionalData?: Record<string, unknown>;
}

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

export async function logUsage(log: UsageLog): Promise<void> {
    logger.info('Usage statistics', log);
} 