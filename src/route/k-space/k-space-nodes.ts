import { readFileSync } from 'fs'
import { SystemId, SystemNode, SystemEdge } from '../../types/types'

export type RawSystem = {
    solarSystemId: number
    solarSystemName: string
    security: number
    regionID: number
    wormholeClassId: number
    connectedSystems: number[]
}

export function getKSpaceNodes(): Map<SystemId, SystemNode> {
    const systemsJson = JSON.parse(
        readFileSync('./public/systems.json', { encoding: 'utf8', flag: 'r' })
    ) as RawSystem[]

    const staticGraph = new Map<SystemId, SystemNode>()
    
    // First pass: create all nodes
    systemsJson.forEach((system) => {
        staticGraph.set(system.solarSystemId, {
            systemId: system.solarSystemId,
            systemName: system.solarSystemName,
            systemSecurityStatus: system.security,
            systemEdges: []
        })
    })

    // Second pass: create edges between connected systems
    systemsJson.forEach((system) => {
        const node = staticGraph.get(system.solarSystemId)
        if (!node) return

        system.connectedSystems.forEach((connectedSystemId) => {
            const connectedSystem = staticGraph.get(connectedSystemId)
            if (!connectedSystem) return

            const edge: SystemEdge = {
                systemId: connectedSystemId,
                systemName: connectedSystem.systemName,
                systemSecurityStatus: connectedSystem.systemSecurityStatus,
                edgeSource: 'k-space'
            }

            node.systemEdges.push(edge)
        })
    })

    return staticGraph
}