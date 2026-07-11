'use server';

import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@shared/types';
import { Database } from '@shared/types/database.types';

export async function getGuildsByOwnerId(ownerId: string) {
    const { data } = await apiClient.get<
        ApiResponse & {
            guilds: Database['public']['Tables']['guilds']['Row'][];
        }
    >(`/guilds/owner/${ownerId}`);

    return data;
}
