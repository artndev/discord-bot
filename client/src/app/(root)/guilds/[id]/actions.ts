'use server';

import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types';
import { GuildSettings } from '@shared/schemas';
import { Database } from '@shared/types/database.types';

export async function getGuildById(guildId: string) {
    const { data } = await apiClient.get<
        ApiResponse & {
            guild: Database['public']['Tables']['guilds']['Row'];
        }
    >(`/guilds/${guildId}`);

    return data;
}

export async function updateGuildSettings(guildId: string, settings: GuildSettings) {
    const { data } = await apiClient.put<ApiResponse>(`/guilds/settings/${guildId}`, settings);

    return data;
}
