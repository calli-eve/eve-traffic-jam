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
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    try {
        // Revoke both access and refresh tokens
        if (accessToken) {
            await fetch('https://login.eveonline.com/v2/oauth/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${EVE_SSO_CLIENT_ID}:${EVE_SSO_SECRET_KEY}`).toString('base64')}`,
                },
                body: new URLSearchParams({
                    token: accessToken,
                    token_type_hint: 'access_token',
                }),
            });
        }

        if (refreshToken) {
            await fetch('https://login.eveonline.com/v2/oauth/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${EVE_SSO_CLIENT_ID}:${EVE_SSO_SECRET_KEY}`).toString('base64')}`,
                },
                body: new URLSearchParams({
                    token: refreshToken,
                    token_type_hint: 'refresh_token',
                }),
            });
        }

        // Clear all auth-related cookies
        res.setHeader('Set-Cookie', [
            'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
            'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
            'character_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
            'character_name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
        ]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
} 