'use client';

import { Match } from '@/components/custom/ui/match';
import { MatchForm, MatchFormMethods } from '@/components/custom/ui/match-form';
import { Settings } from '@/components/custom/ui/settings';
import { IdParam } from '@/types';
import { GuildSettings } from '@shared/types';
import { Database } from '@shared/types/database.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getGuildById } from '../actions';
import { deleteMatch, getAllMatches, registerMatch, sendMatchNotification, updateMatch } from './actions';

export default function Matches() {
    const { id } = useParams<IdParam>();
    const [currentMatch, setCurrentMatch] = useState<Database['public']['Tables']['matches']['Row'] | null>(null);
    const matchForm = useRef<MatchFormMethods | null>(null);

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

    const { mutateAsync: registerMatchMutation, isPending: registerMatchIsPending } = useMutation({
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

    const { mutateAsync: updateMatchMutation, isPending: updateMatchIsPending } = useMutation({
        mutationFn: async ({
            matchId,
            match,
        }: {
            matchId: string;
            match: Omit<Database['public']['Tables']['matches']['Row'], 'guild_id' | 'created_at' | 'id'>;
        }) => {
            if (!id) {
                throw new Error('[matches] id is not provided!');
            }

            const data = await updateMatch(id, matchId, match);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data;
        },
        onSuccess: () => {
            refetch();

            setCurrentMatch(null);

            matchForm.current?.close();
        },
    });

    const { mutateAsync: deleteMatchMutation, isPending: deleteMatchIsPending } = useMutation({
        mutationFn: async ({ matchId }: { matchId: string }) => {
            if (!id) {
                throw new Error('[matches] id is not provided!');
            }

            const data = await deleteMatch(id, matchId);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data;
        },
        onSuccess: () => {
            refetch();
        },
    });

    const handleRegisterMatch = useCallback<
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

    const handleUpdateMatch = useCallback<
        (data: {
            firstCountry: string;
            secondCountry: string;
            firstCountryScore: string;
            secondCountryScore: string;
            date: string;
        }) => void
    >(
        (data) => {
            if (!currentMatch) {
                return;
            }

            updateMatchMutation({
                matchId: currentMatch.id,
                match: {
                    first_country: data.firstCountry,
                    second_country: data.secondCountry,
                    first_country_score: data.firstCountryScore,
                    second_country_score: data.secondCountryScore,
                    date: data.date,
                },
            });
        },
        [updateMatchMutation, currentMatch],
    );

    const matchFormDefaultValues = useMemo(() => {
        return currentMatch
            ? {
                  firstCountry: currentMatch.first_country,
                  secondCountry: currentMatch.second_country,
                  score: currentMatch.first_country_score + currentMatch.second_country_score,
                  date: currentMatch.date,
              }
            : undefined;
    }, [currentMatch]);

    if (
        !matches ||
        isLoading ||
        guildIsLoading ||
        registerMatchIsPending ||
        updateMatchIsPending ||
        deleteMatchIsPending
    ) {
        return <Settings.Skeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <MatchForm onSubmit={handleRegisterMatch} />

            <MatchForm
                key={currentMatch ? currentMatch.id : 'new'}
                ref={matchForm}
                withTrigger={false}
                onSubmit={handleUpdateMatch}
                defaultValues={matchFormDefaultValues}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matches.map((match) => {
                    return (
                        <Match
                            {...match}
                            onRemove={() => deleteMatchMutation({ matchId: match.id })}
                            onEdit={() => {
                                setCurrentMatch(match);

                                setTimeout(() => {
                                    matchForm.current?.open();
                                }, 500);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
