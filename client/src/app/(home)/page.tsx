'use client';

import { Guild } from '@/components/custom/ui/guild/Guild';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { getGuildsByOwnerId } from './actions';

export default function Home() {
    const { user, signOut } = useAuthContext();

    const {
        data: guilds,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['guilds', user?.id],
        queryFn: async () => {
            if (!user?.id) {
                throw new Error('[(home)/page.tsx] owner_id is not properly loaded!');
            }

            const data = await getGuildsByOwnerId(user.id);
            if (data.status !== 200) {
                throw new Error(data.message);
            }

            return data.guilds;
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!user?.id,
    });

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 border-b shadow-lg p-4">
                {!user?.identity_data?.full_name ? (
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Welcome! Here are your guilds,</span>

                        <Skeleton className="w-25 h-7.5" />
                    </div>
                ) : (
                    <span className="text-2xl font-bold">
                        Welcome! Here are your guilds, {user?.identity_data?.full_name}
                    </span>
                )}

                <Button onClick={signOut}>
                    <LogOut />
                    Sign out
                </Button>
            </div>

            <div className="flex gap-3 p-6">
                {guilds && !isLoading
                    ? guilds.map((guild) => <Guild {...guild} />)
                    : new Array(2).fill(null).map((_, i) => {
                          return <Guild.Skeleton key={`guild-skeleton-${i}`} />;
                      })}
            </div>
        </div>
    );
}
