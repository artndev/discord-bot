import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getFlagEmoji } from '@/lib/utils';
import { Database } from '@shared/types/database.types';
import { Pencil, Trash } from 'lucide-react';

export type MatchProps = {
    onEdit?: () => void;
    onRemove?: () => void;
} & Database['public']['Tables']['matches']['Row'];

export function Match({
    id,
    first_country,
    second_country,
    first_country_score,
    second_country_score,
    onEdit,
    onRemove,
}: MatchProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ID: {id}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between gap-6">
                    <div className="flex justify-center items-center size-12 rounded-4xl border p-8">
                        <span className="text-4xl">{getFlagEmoji(first_country)}</span>
                    </div>

                    <div className="flex-1 flex justify-around items-center gap-6">
                        <span className="text-2xl font-semibold">{first_country_score}</span>

                        <span className="text-xl text-muted">/</span>

                        <span className="text-2xl font-semibold">{second_country_score}</span>
                    </div>

                    <div className="flex justify-center items-center size-12 rounded-4xl border p-8">
                        <span className="text-4xl">{getFlagEmoji(second_country)}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="gap-3">
                <Button type="button" variant={'outline'} onClick={onEdit}>
                    <Pencil />
                    Edit
                </Button>

                <Button type="button" variant={'destructive'} onClick={onRemove}>
                    <Trash />
                    Remove
                </Button>
            </CardFooter>
        </Card>
    );
}
