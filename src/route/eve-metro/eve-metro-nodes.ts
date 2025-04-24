import axios from 'axios'
import { SystemEdge, SystemId, SystemNode } from '../../types/types'
import { EveMetroResponse, EveMetroConnection, EveMetroEdge, EveMetroRequest } from './types'

const EVE_METRO_API_KEY = process.env.EVE_METRO_API_KEY || ''
const EVE_METRO_API_URL = process.env.EVE_METRO_API_URL || ''
const EVE_METRO_CHARACTER_ID = process.env.EVE_METRO_CHARACTER_ID ? parseInt(process.env.EVE_METRO_CHARACTER_ID) : undefined
const EVE_METRO_CORPORATION_ID = process.env.EVE_METRO_CORPORATION_ID ? parseInt(process.env.EVE_METRO_CORPORATION_ID) : undefined
const EVE_METRO_ALLIANCE_ID = process.env.EVE_METRO_ALLIANCE_ID ? parseInt(process.env.EVE_METRO_ALLIANCE_ID) : undefined

// Cache variables
let cachedNodes: Map<SystemId, SystemNode> | null = null
let lastFetchTime: number = 0
const CACHE_DURATION_MS = 60 * 1000 // 1 minute in milliseconds

export const getEveMetroNodes = async (): Promise<Map<SystemId, SystemNode>> => {
    const now = Date.now()
    
    // Return cached data if it's still valid
    if (cachedNodes && (now - lastFetchTime) < CACHE_DURATION_MS) {
        return cachedNodes
    }

    try {
        const request: EveMetroRequest = {
            ...(EVE_METRO_CHARACTER_ID && { character_id: EVE_METRO_CHARACTER_ID }),
            ...(EVE_METRO_CORPORATION_ID && { corporation_id: EVE_METRO_CORPORATION_ID }),
            ...(EVE_METRO_ALLIANCE_ID && { alliance_id: EVE_METRO_ALLIANCE_ID })
        }

        const response = await axios.post<EveMetroResponse>(EVE_METRO_API_URL, request, {
            headers: {
                'x-api-key': EVE_METRO_API_KEY
            }
        })

        if (!response.data.access || !response.data.connections) {
            console.warn('No access or connections in EVE Metro response')
            return new Map()
        }

        cachedNodes = new Map(
            response.data.connections.map((node: EveMetroConnection) => {
                const systemNode: SystemNode = {
                    systemId: node.systemId,
                    systemName: node.systemName,
                    systemSecurityStatus: node.systemSecurityStatus,
                    systemEdges: node.systemEdges.map((edge: EveMetroEdge): SystemEdge => ({
                        systemId: edge.solarSystemIdDst,
                        systemName: edge.solarSystemNameDst,
                        systemSecurityStatus: edge.solarSystemSecDst,
                        edgeSource: 'eve-metro'
                    }))
                }
                return [node.systemId, systemNode]
            })
        )
        lastFetchTime = now
        return cachedNodes
    } catch (e) {
        console.error('Error fetching EVE Metro nodes:', e)
        return new Map()
    }
} 