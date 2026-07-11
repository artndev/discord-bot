import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@shared/types/database.types';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/navigation';
import { JSX, useMemo } from 'react';

export type GuildProps = Database['public']['Tables']['guilds']['Row'];

function GuildComponent({ id, icon, name }: GuildProps) {
    const router = useRouter();

    const guildIcon = useMemo(() => {
        return (
            <div className="size-12">
                <Avatar className="size-full">
                    <AvatarImage src={icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=128` : null} />

                    <AvatarFallback className="text-2xl sm:text-4xl">
                        {name ? capitalize(name.slice(0, 2)) : 'MS'}
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    }, [id, name, icon]);

    return (
        <Card className="w-80">
            <CardHeader>
                <div className="flex items-center gap-3 ">
                    {guildIcon} <CardTitle>{name}</CardTitle>
                </div>
            </CardHeader>

            <CardFooter>
                <Button onClick={() => router.replace(`/guilds/${id}`)}>Manage Instance</Button>
            </CardFooter>
        </Card>
    );
}

function GuildSkeletonComponent() {
    return <Skeleton className="w-80 h-40 rounded-4xl" />;
}

export type GuildComponentType = {
    (props: GuildProps): JSX.Element;
    displayName: string;
    Skeleton: typeof GuildSkeletonComponent & { displayName: string };
};

export const Guild = Object.assign(GuildComponent, {
    displayName: 'Guild',
    Skeleton: Object.assign(GuildSkeletonComponent, {
        displayName: 'GuildSkeleton',
    }),
});
