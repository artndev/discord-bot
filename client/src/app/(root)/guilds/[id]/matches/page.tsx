'use client';

import { MatchForm } from '@/components/custom/ui/match-form';
import { IdParam } from '@/types';
import { useParams } from 'next/navigation';

export default function Matches() {
    const { id } = useParams<IdParam>();

    return (
        <div className="flex flex-col gap-6">
            <MatchForm onSubmit={(data) => console.log(data)} />
        </div>
    );
}
