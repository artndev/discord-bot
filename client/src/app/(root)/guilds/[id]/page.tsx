'use client';

import { Settings } from '@/components/custom/ui/settings';
import { IdParam } from '@/types';
import { GuildSettings, guildSettingSchema } from '@shared/schemas';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getGuildById, updateGuildSettings } from './actions';

// TODO:
// During refetch - place loading screen to disable touching

export default function Guild() {
    const { id } = useParams<IdParam>();

    const {
        data: guild,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['guild', id],
        queryFn: async () => {
            if (!id) {
                throw new Error('[(guilds)/[id]/page.tsx] id is not provided!');
            }

            const data = await getGuildById(id);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data.guild;
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });

    const { mutateAsync: updateGuildSettingsMutate, isPending } = useMutation({
        mutationFn: async (settings: GuildSettings) => {
            if (!id) {
                throw new Error('[(guilds)/[id]/page.tsx] id is not provided!');
            }

            const data = await updateGuildSettings(id, settings);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data;
        },
        onSuccess: () => {
            refetch();
        },
    });

    if (!guild || isLoading || isPending) {
        return <Settings.Skeleton />;
    }

    return (
        <Settings
            schema={guildSettingSchema._def.innerType}
            defaultValues={guild.settings as any}
            onSubmit={updateGuildSettingsMutate}
        />
    );
}
