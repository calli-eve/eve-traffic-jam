import axios from 'axios';

interface UsageLog {
    timestamp: string;
    event: 'login' | 'path_calculation';
    characterId: string;
    characterName: string;
    corporationId?: number;
    additionalData?: Record<string, any>;
}

const LOGGING_ENDPOINT = process.env.LOGGING_ENDPOINT;

export async function logUsage(log: UsageLog): Promise<void> {
    console.log('Usage statistics:', log);
} 