import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getFlagEmoji } from '@/lib/utils';
import { Database } from '@shared/types/database.types';
import { format } from 'date-fns';
import { Clock, Pencil, Trash } from 'lucide-react';

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
    date,
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
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex justify-center items-center size-12 rounded-4xl border p-8">
                                <span className="text-4xl">{getFlagEmoji(first_country)}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{first_country}</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="flex-1 flex justify-around items-center gap-6">
                        <span className="text-2xl font-semibold">{first_country_score}</span>

                        <span className="text-xl text-muted">/</span>

                        <span className="text-2xl font-semibold">{second_country_score}</span>
                    </div>

                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex justify-center items-center size-12 rounded-4xl border p-8">
                                <span className="text-4xl">{getFlagEmoji(second_country)}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{second_country}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-end gap-3 w-full">
                <div className="flex items-start gap-3 w-full">
                    <Button type="button" variant={'outline'} onClick={onEdit}>
                        <Pencil />
                        Edit
                    </Button>

                    <Button type="button" variant={'destructive'} onClick={onRemove}>
                        <Trash />
                        Remove
                    </Button>
                </div>

                <div className="flex items-center gap-1.5 text-muted font-medium">
                    <Clock width={16} height={16} />
                    {format(date, 'dd MMMM, yyyy')}
                </div>
            </CardFooter>
        </Card>
    );
}
