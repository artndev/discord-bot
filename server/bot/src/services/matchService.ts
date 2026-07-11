import { ApiResponse, Database } from '@shared/types';
import { apiClient } from './axios';

export const getAllMatches = async (guildId: string) => {
    const { data } = await apiClient.get<ApiResponse & { matches: Database['public']['Tables']['matches']['Row'][] }>(
        `/guilds/${guildId}/matches`,
    );

    return data.matches;
};
