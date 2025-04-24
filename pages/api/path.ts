import { NextApiRequest, NextApiResponse } from 'next'
import { calculateRoute, CalculateRouteInput } from '../../src/route/path-calculator'

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
        res.status(200).json(result)
    } catch (error) {
        console.error('Error calculating path:', error)
        res.status(500).json({ message: 'Error calculating path' })
    }
} 