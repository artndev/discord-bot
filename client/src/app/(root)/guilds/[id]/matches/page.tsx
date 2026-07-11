'use client';

import { MatchForm } from '@/components/custom/ui/match-form';
import { Settings } from '@/components/custom/ui/settings';
import { IdParam } from '@/types';
import { Database } from '@shared/types/database.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { getAllMatches, registerMatch } from './actions';

export default function Matches() {
    const { id } = useParams<IdParam>();

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

    const { mutateAsync: updateGuildSettingsMutate, isPending } = useMutation({
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

            return data;
        },
        onSuccess: () => {
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
            updateGuildSettingsMutate({
                first_country: data.firstCountry,
                second_country: data.secondCountry,
                first_country_score: data.firstCountryScore,
                second_country_score: data.secondCountryScore,
                date: data.date,
            });
        },
        [updateGuildSettingsMutate],
    );

    if (!matches || isLoading || isPending) {
        return <Settings.Skeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <MatchForm onSubmit={handleOnSubmit} />
        </div>
    );
}
