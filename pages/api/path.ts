import { NextApiRequest, NextApiResponse } from 'next'
import { calculateRoute, CalculateRouteInput } from '../../src/route/path-calculator'
import { parse } from 'cookie'
import { getCharacterAffiliation } from '../../src/utils/eve-api'
import { isCorporationAllowed } from '../../src/utils/auth'
import { logUsage } from '../../src/utils/logging'

interface PathRequest {
    from: number
    to: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    try {
        // Check authentication
        const cookies = parse(req.headers.cookie || '')
        const accessToken = cookies.access_token
        const characterId = cookies.character_id
        const characterName = cookies.character_name

        if (!accessToken || !characterId) {
            res.status(401).json({ message: 'Authentication required' })
            return
        }

        // Get character affiliation and check if corporation is allowed
        const affiliation = await getCharacterAffiliation(parseInt(characterId), accessToken)
        if (!isCorporationAllowed(affiliation.corporation_id)) {
            res.status(403).json({ message: 'Access denied: Corporation not authorized' })
            return
        }

        const { from, to } = req.body as PathRequest

        if (!from || !to) {
            res.status(400).json({ message: 'Missing required parameters: from and to system IDs' })
            return
        }

        const input: CalculateRouteInput = {
            startSystemId: from,
            endSystemId: to,
            avoidSystemIds: [],
            useEveScout: true,
            useTripwire: true,
            useEveMetro: true,
            shipSize: 'Frigate'
        }

        const result = await calculateRoute(input)

        // Log successful path calculation
        await logUsage({
            timestamp: new Date().toISOString(),
            event: 'path_calculation',
            characterId,
            characterName: characterName || 'Unknown',
            corporationId: affiliation.corporation_id,
            additionalData: {
                fromSystemId: from,
                toSystemId: to,
                pathLength: result.length,
                usedEveScout: input.useEveScout,
                usedTripwire: input.useTripwire,
                usedEveMetro: input.useEveMetro,
            }
        });

        res.status(200).json(result)
    } catch (error) {
        console.error('Error calculating path:', error)
        res.status(500).json({ message: 'Error calculating path' })
    }
} 