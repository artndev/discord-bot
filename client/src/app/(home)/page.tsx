'use client';

import { ErrorOverlay } from '@/components/custom/ui/error-overlay';
import { Guild } from '@/components/custom/ui/guild/Guild';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { inviteBot } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { getGuildsByOwnerId } from './actions';

export default function Home() {
    const { user, signOut } = useAuthContext();

    const {
        data: guilds,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['guilds', user?.id],
        queryFn: async () => {
            // await new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         reject(new Error('Test'));
            //     }, 2000);
            // });

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

    if (error) {
        return <ErrorOverlay isEnabled={!!error} onRetry={refetch} />;
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 border-b shadow-lg p-4 bg-card">
                {!user?.identity_data?.full_name ? (
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Welcome back! Here are your guilds,</span>

                        <Skeleton className="w-25 h-7.5" />
                    </div>
                ) : (
                    <span className="text-2xl font-bold">Here are your guilds, {user?.identity_data?.full_name}</span>
                )}

                <Button onClick={signOut}>
                    <LogOut />
                    Sign out
                </Button>
            </div>

            <div className="flex items-center gap-6 p-6">
                {guilds && !isLoading
                    ? guilds.map((guild) => {
                          return <Guild {...guild} />;
                      })
                    : new Array(2).fill(null).map((_, i) => {
                          return <Guild.Skeleton key={`guild-skeleton-${i}`} />;
                      })}

                <motion.div
                    initial={{
                        scale: 0.95,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                    }}
                    whileHover={{ scale: 1 }}
                    className="cursor-pointer w-80 h-full min-h-[155px]"
                    onClick={inviteBot}>
                    <Card className="size-full">
                        <CardContent className="flex justify-center items-center size-full">
                            <Plus />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
