import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types';
import { Database } from '@shared/types/database.types';

export async function checkGuildByOwnerId(ownerId: string, guildId: string) {
    const {
        data: { guilds },
    } = await apiClient.get<
        ApiResponse & {
            guilds: Database['public']['Tables']['guilds']['Row'][];
        }
    >(`/guilds/owner/${ownerId}`);

    return !!guilds.find((val) => {
        return val.id === guildId;
    });
}
