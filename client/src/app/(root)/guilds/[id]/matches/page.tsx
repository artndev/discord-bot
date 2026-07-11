'use client';

import { MatchForm } from '@/components/custom/ui/match-form';
import { Settings } from '@/components/custom/ui/settings';
import { IdParam } from '@/types';
import { GuildSettings } from '@shared/schemas';
import { Database } from '@shared/types/database.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { getGuildById } from '../actions';
import { getAllMatches, registerMatch, sendMatchNotification } from './actions';

export default function Matches() {
    const { id } = useParams<IdParam>();

    const {
        data: guild,
        isLoading: guildIsLoading,
        error: guildError,
        refetch: guildRefetch,
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

    const {
        data: matches,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['matches', id],
        queryFn: async () => {
            if (!id) {
                throw new Error('[matches] id is not provided!');
            }

            const data = await getAllMatches(id);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data.matches;
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });

    const { mutateAsync: registerMatchMutation, isPending } = useMutation({
        mutationFn: async (
            match: Omit<Database['public']['Tables']['matches']['Row'], 'guild_id' | 'created_at' | 'id'>,
        ) => {
            if (!id) {
                throw new Error('[matches] id is not provided!');
            }

            const data = await registerMatch(id, match);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data.match;
        },
        onSuccess: async (match) => {
            try {
                const webhookUrl = guild?.settings?.meta?.webhookUrl;

                if (webhookUrl) {
                    const res = await sendMatchNotification(webhookUrl, match);

                    if (res.ok) {
                        toast.success('Match created and notified! 🎮');
                    } else {
                        toast.error('Match created, but failed to notify via Discord ⚠️');
                    }
                } else {
                    toast.success('Match created! (No webhook configured) 🎮');
                }
            } catch (err) {}

            refetch();
        },
    });

    const handleOnSubmit = useCallback<
        (data: {
            firstCountry: string;
            secondCountry: string;
            firstCountryScore: string;
            secondCountryScore: string;
            date: string;
        }) => void
    >(
        (data) => {
            registerMatchMutation({
                first_country: data.firstCountry,
                second_country: data.secondCountry,
                first_country_score: data.firstCountryScore,
                second_country_score: data.secondCountryScore,
                date: data.date,
            });
        },
        [registerMatchMutation],
    );

    if (!matches || isLoading || guildIsLoading || isPending) {
        return <Settings.Skeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <MatchForm onSubmit={handleOnSubmit} />
        </div>
    );
}
