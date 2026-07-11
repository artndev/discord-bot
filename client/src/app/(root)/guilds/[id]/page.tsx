'use client';

import { Settings } from '@/components/custom/ui/settings';
import { WebhookForm } from '@/components/custom/ui/webhook-form/WebhookForm';
import { Separator } from '@/components/ui/separator';
import { IdParam } from '@/types';
import { guildSettingSchema } from '@shared/schemas';
import { GuildSettings } from '@shared/types';
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

            return { ...data.guild, settings: data.guild.settings as GuildSettings };
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
        <div className="flex flex-col gap-6">
            <WebhookForm
                defaultValues={{ webhookUrl: guild.settings?.meta?.webhookUrl ?? '' }}
                onSubmit={({ webhookUrl }) => updateGuildSettingsMutate({ meta: { webhookUrl } })}
            />

            <Separator />

            <Settings
                schema={guildSettingSchema._def.innerType}
                defaultValues={guild.settings as any}
                onSubmit={updateGuildSettingsMutate}
                descriptions={{
                    ai_profile:
                        'Default profile that is used in AI-associated slash commands. It is used globally until a user decides to switch to another profile.',
                    enable_echoing:
                        'Echoing is determined to alert members of the server about creation of matches; in order to do so, you need to be equipped with a webhook.',
                }}
            />
        </div>
    );
}
