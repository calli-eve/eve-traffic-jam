import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = parse(req.headers.cookie || '');
    
    if (!cookies.access_token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    res.status(200).json({
        characterId: cookies.character_id,
        characterName: cookies.character_name,
        isAuthenticated: true
    });
} 