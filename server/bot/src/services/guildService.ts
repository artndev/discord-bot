import { apiClient } from './axios';

export const registerGuild = async (id: string, name: string, ownerId: string) => {
    try {
        const response = await apiClient.post('/guilds', {
            id,
            name,
            owner_id: ownerId,
        });

        return response.data;
    } catch (err) {
        console.warn('[guildService]', err);
    }
};

export const deleteGuild = async (id: string) => {
    try {
        const response = await apiClient.delete(`/guilds/${id}`);

        return response.data;
    } catch (err) {
        console.warn('[guildService]', err);
    }
};

export const updateGuildSettings = async (id: string, settings: Record<string, any>) => {
    const response = await apiClient.put(`/guilds/settings/${id}`, settings);

    return response.data;
};
