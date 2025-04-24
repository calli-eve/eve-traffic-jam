import axios from 'axios'
import { TURNUR_SYSTEM_ID } from '../../const'
import { EdgeSource, SystemEdge, SystemId, SystemNode } from '../../types/types'

const EVE_SCOUT_PUBLIC_SIGNATURE_URL = process.env.EVE_SCOUT_PUBLIC_SIGNATURE_URL || ''

// Cache variables
let cachedNodes: SystemNode[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION_MS = 60 * 1000 // 1 minute in milliseconds

export interface EveScoutConnection {
    id: string
    created_at: Date
    created_by_id: number
    created_by_name: string
    updated_at: Date
    updated_by_id: number
    updated_by_name: string
    completed_at: Date
    completed_by_id: number
    completed_by_name: string
    completed: boolean
    wh_exits_outward: boolean
    wh_type: string
    max_ship_size: MaxShipSize
    expires_at: Date
    remaining_hours: number
    signature_type: SignatureType
    out_system_id: number
    out_system_name: OutSystemName
    out_signature: string
    in_system_id: number
    in_system_class: string
    in_system_name: string
    in_region_id: number
    in_region_name: string
    in_signature: string
}

export enum MaxShipSize {
    Capital = 'capital',
    Large = 'large',
    Medium = 'medium',
    Xlarge = 'xlarge'
}

export enum OutSystemName {
    Thera = 'Thera',
    Turnur = 'Turnur'
}

export enum SignatureType {
    Wormhole = 'wormhole'
}

export const fetchEveScoutData = () => axios.get<EveScoutConnection[]>(EVE_SCOUT_PUBLIC_SIGNATURE_URL)

export const mapEveScoutDataToNodes = (data: EveScoutConnection[]): SystemNode[] => {
    const nodes: SystemNode[] = []
    const processedSystemIds = new Set<SystemId>()

    // Process wormhole connections
    data.forEach((wormhole) => {
        const edgeSource: EdgeSource = wormhole.out_system_id === TURNUR_SYSTEM_ID ? 'eve-scout-turnur' : 'eve-scout-thera'
        
        // Create edge for the destination system
        const edge: SystemEdge = {
            systemId: wormhole.out_system_id,
            systemName: wormhole.out_system_name,
            systemSecurityStatus: wormhole.out_system_id === TURNUR_SYSTEM_ID ? 0.387 : -0.99,
            edgeSource
        }

        // Create or update the source system node
        if (!processedSystemIds.has(wormhole.in_system_id)) {
            nodes.push({
                systemId: wormhole.in_system_id,
                systemName: wormhole.in_system_name,
                systemSecurityStatus: -0.99, // Default security for wormhole systems
                systemEdges: [edge]
            })
            processedSystemIds.add(wormhole.in_system_id)
        } else {
            const existingNode = nodes.find(n => n.systemId === wormhole.in_system_id)
            if (existingNode) {
                existingNode.systemEdges.push(edge)
            }
        }

        // Create or update the destination system node (Thera or Turnur)
        if (!processedSystemIds.has(wormhole.out_system_id)) {
            const reverseEdge: SystemEdge = {
                systemId: wormhole.in_system_id,
                systemName: wormhole.in_system_name,
                systemSecurityStatus: -0.99,
                edgeSource
            }

            nodes.push({
                systemId: wormhole.out_system_id,
                systemName: wormhole.out_system_name,
                systemSecurityStatus: wormhole.out_system_id === TURNUR_SYSTEM_ID ? 0.387 : -0.99,
                systemEdges: [reverseEdge]
            })
            processedSystemIds.add(wormhole.out_system_id)
        } else {
            const existingNode = nodes.find(n => n.systemId === wormhole.out_system_id)
            if (existingNode) {
                const reverseEdge: SystemEdge = {
                    systemId: wormhole.in_system_id,
                    systemName: wormhole.in_system_name,
                    systemSecurityStatus: -0.99,
                    edgeSource
                }
                existingNode.systemEdges.push(reverseEdge)
            }
        }
    })

    return nodes
}

export async function getEveScoutNodes(): Promise<SystemNode[]> {
    const now = Date.now()
    
    // Return cached data if it's still valid
    if (cachedNodes && (now - lastFetchTime) < CACHE_DURATION_MS) {
        return cachedNodes
    }

    const { data } = await fetchEveScoutData()
    cachedNodes = mapEveScoutDataToNodes(data)
    lastFetchTime = now
    return cachedNodes
} 