import axios from 'axios';

interface CharacterAffiliation {
    character_id: number;
    corporation_id: number;
    alliance_id?: number;
}

export async function getCharacterAffiliation(characterId: number, accessToken: string): Promise<CharacterAffiliation> {
    try {
        const response = await axios.post<CharacterAffiliation[]>(
            `https://esi.evetech.net/latest/characters/affiliation/`,
            [characterId],
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.length === 0) {
            throw new Error('Character affiliation not found');
        }

        return response.data[0];
    } catch (error) {
        console.error('Error fetching character affiliation:', error);
        throw error;
    }
}