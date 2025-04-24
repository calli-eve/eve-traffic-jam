export type SystemId = number
export type SystemName = string
export type SystemSecurityStatus = number
export type ShipSize = 'Frigate' | 'Cruiser' | 'Battleship' | 'Freighter' | 'Capital'

export type EdgeSource = 'k-space' | 'eve-scout-thera' | 'eve-scout-turnur' | 'tripwire' | 'eve-metro'

export interface SystemEdge {
    systemId: SystemId
    systemName: SystemName
    systemSecurityStatus: SystemSecurityStatus
    edgeSource: EdgeSource
}

export interface SystemNode {
    systemId: SystemId
    systemName: SystemName
    systemSecurityStatus: SystemSecurityStatus
    systemEdges: SystemEdge[]
}