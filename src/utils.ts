import { ShipSize } from './types/types'

export const calculateShipSizeBySecurityStatus = (security: number): ShipSize => {
    if (security <= 0) return 'Frigate'
    if (security < 0.5) return 'Cruiser'
    return 'Freighter'
}

export const calculateShipSizeBySystemClass = (systemClass: number): ShipSize => {
    if (systemClass === 1) return 'Frigate'
    if (systemClass === 2) return 'Cruiser'
    if (systemClass === 3) return 'Battleship'
    return 'Freighter'
}

export const calculateShipSizeByWh = (wormholeTypes: string[]): ShipSize => {
    const maxJumpMass = Math.min(
        ...wormholeTypes.map((type) => {
            if (type === 'K162') return Number.MAX_SAFE_INTEGER
            return 300000000 // Default to cruiser size
        })
    )

    if (maxJumpMass <= 62000000) return 'Frigate'
    if (maxJumpMass <= 300000000) return 'Cruiser'
    if (maxJumpMass <= 1350000000) return 'Battleship'
    return 'Freighter'
}

export const canShipPassMassTest = (edgeShipSize: ShipSize, shipSize: ShipSize): boolean => {
    const shipSizes: ShipSize[] = ['Frigate', 'Cruiser', 'Battleship', 'Freighter', 'Capital']
    const edgeIndex = shipSizes.indexOf(edgeShipSize)
    const shipIndex = shipSizes.indexOf(shipSize)
    return shipIndex <= edgeIndex
}

export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
    return array.reduce((result, currentValue) => {
        const groupKey = String(currentValue[key])
        if (!result[groupKey]) {
            result[groupKey] = []
        }
        result[groupKey].push(currentValue)
        return result
    }, {} as { [key: string]: T[] })
}

export const groupByFrom = <T>(array: T[], key: keyof T): { [key: string]: T } => {
    return array.reduce((result, currentValue) => {
        const groupKey = String(currentValue[key])
        result[groupKey] = currentValue
        return result
    }, {} as { [key: string]: T })
}

export const getCopyPasteRoute = (route: string[]): string => {
    return route.join('\n')
} 