import { parse } from 'cookie';

export interface CharacterInfo {
    characterId: string;
    characterName: string;
    isAuthenticated: boolean;
}

export async function getCharacterInfo(cookieHeader?: string): Promise<CharacterInfo> {
    if (typeof window === 'undefined') {
        // Server-side
        if (!cookieHeader) {
            return {
                characterId: '',
                characterName: '',
                isAuthenticated: false,
            };
        }
        const cookies = parse(cookieHeader);
        return {
            characterId: cookies.character_id || '',
            characterName: cookies.character_name || '',
            isAuthenticated: !!cookies.access_token,
        };
    } else {
        // Client-side - fetch from API
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                return await response.json();
            }
            return {
                characterId: '',
                characterName: '',
                isAuthenticated: false,
            };
        } catch (error) {
            console.error('Failed to fetch character info:', error);
            return {
                characterId: '',
                characterName: '',
                isAuthenticated: false,
            };
        }
    }
}

export async function refreshSession(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // If refresh fails, clear the session
            await logout();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Session refresh error:', error);
        await logout();
        return false;
    }
}

export async function logout(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        // Redirect to home page after successful logout
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        // Even if the server logout fails, try to clear local state
        window.location.href = '/';
    }
} 


