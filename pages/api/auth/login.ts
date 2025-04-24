import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';

const EVE_SSO_CLIENT_ID = process.env.EVE_SSO_CLIENT_ID;
const EVE_SSO_CALLBACK_URL = process.env.EVE_SSO_CALLBACK_URL || 'http://localhost:3000/callback';
const EVE_SSO_SCOPES = 'publicData esi-location.read_location.v1 esi-location.read_ship_type.v1';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!EVE_SSO_CLIENT_ID) {
        return res.status(500).json({ error: 'SSO configuration missing' });
    }

    // Generate a random state parameter to prevent CSRF attacks
    const state = randomBytes(32).toString('hex');
    
    // Store the state in a secure HTTP-only cookie
    res.setHeader('Set-Cookie', `sso_state=${state}; HttpOnly; Path=/; SameSite=Strict`);

    // Construct the SSO authorization URL
    const authUrl = new URL('https://login.eveonline.com/v2/oauth/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', EVE_SSO_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', EVE_SSO_CALLBACK_URL);
    authUrl.searchParams.append('scope', EVE_SSO_SCOPES);
    authUrl.searchParams.append('state', state);

    // Redirect to EVE SSO
    res.redirect(authUrl.toString());
} 