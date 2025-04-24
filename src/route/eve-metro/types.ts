export interface EveMetroResponse {
    access: boolean
    connections: EveMetroConnection[]
}

export interface EveMetroConnection {
    systemId: number
    systemName: string
    systemSecurityStatus: number
    systemEdges: EveMetroEdge[]
}

export interface EveMetroEdge {
    solarSystemIdDst: number
    solarSystemNameDst: string
    solarSystemSecDst: number
    signatureSrc: string
    signatureDst: string
    wormholeTypeSrc: string
    wormholeTypeDst: string
    wormholeMass: string
    wormholeEol: string
    createdTime: Date
    lastSeenTime: Date
}

export interface EveMetroRequest {
    character_id?: number
    corporation_id?: number
    alliance_id?: number
}

export interface EveMetroRequestHeaders {
    'x-api-key': string
}

