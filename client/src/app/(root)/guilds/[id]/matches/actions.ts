'use server';

import { apiClient, globalApiClient } from '@/lib/axios';
import { ApiResponse } from '@/types';
import { Database } from '@shared/types/database.types';
import axios from 'axios';

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
    const { data } = await apiClient.post<
        ApiResponse & {
            match: Database['public']['Tables']['matches']['Row'];
        }
    >(`/guilds/${guildId}/matches`, match);

    return data;
}

export async function updateMatch(
    guildId: string,
    matchId: string,
    match: Omit<Database['public']['Tables']['matches']['Row'], 'guild_id' | 'created_at' | 'id'>,
) {
    const { data } = await apiClient.put<ApiResponse>(`/guilds/${guildId}/matches/${matchId}`, match);

    return data;
}

export async function sendMatchNotification(webhookUrl: string, match: Database['public']['Tables']['matches']['Row']) {
    const payload = {
        embeds: [
            {
                title: '🎮 New Match Created!',
                color: 0x00ff00,
                fields: [
                    { name: 'Match ID', value: match.id, inline: true },
                    { name: 'Status', value: 'Pending', inline: true },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        await globalApiClient.post(webhookUrl, JSON.stringify(payload));

        return { ok: true };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            return { ok: false, err: `Discord returned error: ${status || 'Unknown'}` };
        }

        return { ok: false, err: 'Could not connect to Discord. Please check your internet connection.' };
    }
}
