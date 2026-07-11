'use server';

import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types';
import { Database } from '@shared/types/database.types';

export async function getAllMatches(guildId: string) {
    const { data } = await apiClient.get<
        ApiResponse & {
            matches: Database['public']['Tables']['matches']['Row'][];
        }
    >(`/guilds/${guildId}/matches`);

    return data;
}

export async function registerMatch(
    guildId: string,
    match: Omit<Database['public']['Tables']['matches']['Row'], 'guild_id' | 'created_at' | 'id'>,
) {
    const { data } = await apiClient.post<ApiResponse>(`/guilds/${guildId}/matches`, match);

    return data;
}
