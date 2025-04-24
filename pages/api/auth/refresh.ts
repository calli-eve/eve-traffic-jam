import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const EVE_SSO_CLIENT_ID = process.env.EVE_SSO_CLIENT_ID;
const EVE_SSO_SECRET_KEY = process.env.EVE_SSO_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!EVE_SSO_CLIENT_ID || !EVE_SSO_SECRET_KEY) {
        return res.status(500).json({ error: 'SSO configuration missing' });
    }

    const cookies = parse(req.headers.cookie || '');
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token found' });
    }

    try {
        // Exchange refresh token for new access token
        const tokenResponse = await fetch('https://login.eveonline.com/v2/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${EVE_SSO_CLIENT_ID}:${EVE_SSO_SECRET_KEY}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to refresh token');
        }

        const tokenData = await tokenResponse.json();

        // Verify the new token and get character information
        const verifyResponse = await fetch('https://login.eveonline.com/oauth/verify', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });

        if (!verifyResponse.ok) {
            throw new Error('Failed to verify token');
        }

        const characterData = await verifyResponse.json();

        // Store the new token and character data in secure HTTP-only cookies
        res.setHeader('Set-Cookie', [
            `access_token=${tokenData.access_token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${tokenData.expires_in}`,
            `refresh_token=${tokenData.refresh_token}; HttpOnly; Path=/; SameSite=Strict`,
            `character_id=${characterData.CharacterID}; HttpOnly; Path=/; SameSite=Strict`,
            `character_name=${characterData.CharacterName}; HttpOnly; Path=/; SameSite=Strict`,
        ]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
} 