import { RawSystem } from "../route/k-space/k-space-nodes";

export interface System {
    id: number;
    name: string;
}

let systemsData: System[] = [];

export async function loadSystems(): Promise<System[]> {
    if (systemsData.length > 0) {
        return systemsData;
    }

    try {
        const response = await fetch('/systems.json');
        const data = await response.json();
        systemsData = data.map((system: RawSystem) => ({
            id: system.solarSystemId,
            name: system.solarSystemName
        }));
        return systemsData;
    } catch (error) {
        console.error('Failed to load systems:', error);
        return [];
    }
}

export function getSystems(): System[] {
    if (systemsData.length === 0) {
        throw new Error('Systems not loaded. Call loadSystems() first.');
    }
    return systemsData;
} 