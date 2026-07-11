import { ApiResponse, Database, GuildSettings } from '@shared/types';
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

export const updateGuildSettings = async (id: string, settings: GuildSettings) => {
    const response = await apiClient.put(`/guilds/settings/${id}`, settings);

    return response.data;
};

export const getGuildById = async (id: string) => {
    const { data } = await apiClient.get<ApiResponse & { guild: Database['public']['Tables']['guilds']['Row'] }>(
        `/guilds/${id}`,
    );

    return { ...data.guild, settings: data.guild.settings as GuildSettings };
};
