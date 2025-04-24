import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { logUsage } from '../../../src/utils/logging';

const EVE_SSO_CLIENT_ID = process.env.EVE_SSO_CLIENT_ID;
const EVE_SSO_SECRET_KEY = process.env.EVE_SSO_SECRET_KEY;
const EVE_SSO_CALLBACK_URL = process.env.EVE_SSO_CALLBACK_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!EVE_SSO_CLIENT_ID || !EVE_SSO_SECRET_KEY || !EVE_SSO_CALLBACK_URL) {
        return res.status(500).json({ error: 'SSO configuration missing' });
    }

    const { code, state } = req.body;
    const cookies = parse(req.headers.cookie || '');
    const storedState = cookies.sso_state;

    // Verify state parameter to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
        return res.status(400).json({ error: 'Invalid state parameter' });
    }

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://login.eveonline.com/v2/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${EVE_SSO_CLIENT_ID}:${EVE_SSO_SECRET_KEY}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to obtain access token');
        }

        const tokenData = await tokenResponse.json();

        // Verify the token and get character information
        const verifyResponse = await fetch('https://login.eveonline.com/oauth/verify', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });

        if (!verifyResponse.ok) {
            throw new Error('Failed to verify token');
        }

        const characterData = await verifyResponse.json();

        // Log successful login
        await logUsage({
            timestamp: new Date().toISOString(),
            event: 'login',
            characterId: characterData.CharacterID,
            characterName: characterData.CharacterName,
        });

        // Store the token and character data in secure HTTP-only cookies
        res.setHeader('Set-Cookie', [
            `access_token=${tokenData.access_token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${tokenData.expires_in}`,
            `refresh_token=${tokenData.refresh_token}; HttpOnly; Path=/; SameSite=Strict`,
            `character_id=${characterData.CharacterID}; HttpOnly; Path=/; SameSite=Strict`,
            `character_name=${characterData.CharacterName}; HttpOnly; Path=/; SameSite=Strict`,
        ]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('SSO callback error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
} 