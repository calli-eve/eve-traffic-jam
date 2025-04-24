interface UsageLog {
    timestamp: string;
    event: 'login' | 'path_calculation';
    characterId: string;
    characterName: string;
    corporationId?: number;
    additionalData?: Record<string, unknown>;
}

export async function logUsage(log: UsageLog): Promise<void> {
    console.log('Usage statistics:', log);
} 