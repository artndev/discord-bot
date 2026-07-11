'use client';

import { BongoCat, BongoCatMethods } from '@/components/custom/ui/bongo-cat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { ExternalLinkIcon, HomeIcon, MoonIcon, SunIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function Account() {
    const router = useRouter();
    const { user } = useAuthContext();
    const { theme, setTheme } = useTheme();
    const bongoCatRef = useRef<BongoCatMethods | null>(null);

    if (!user) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col items-center gap-24">
            <div className="relative h-24 w-full">
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                        background: [
                            'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                            'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                            'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                            'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
                            'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        ],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 size-24">
                    <Avatar className="relative size-full border-background border-4">
                        <AvatarImage src={user.identity_data?.avatar_url} />

                        <AvatarFallback className="text-2xl sm:text-4xl">MS</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="flex justify-center items-center w-full max-w-200 min-h-100">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 size-full">
                    <div className="flex-1 flex flex-col">
                        <Card className="flex-1">
                            <CardHeader>
                                <h1 className="text-4xl font-bold">Hello,</h1>

                                <h1 className="text-4xl font-bold">{user.identity_data?.full_name}!</h1>

                                <CardDescription>Determine whatever you prefer exactly here.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <Button
                                        className="w-1/2"
                                        onClick={() => {
                                            bongoCatRef.current?.tap();

                                            setTheme((prev: any) => {
                                                return prev === 'light' ? 'dark' : 'light';
                                            });
                                        }}>
                                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex-1 flex sm:flex-col flex-col-reverse gap-6 h-full">
                        <Card className=" size-37.5 p-0">
                            <BongoCat ref={bongoCatRef} width={150} height={150} />
                        </Card>

                        <Card className="order-2">
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>

                                <CardDescription>
                                    Jump between your server instances, ask the bot for a party and manage your
                                    authentication state.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-3">
                                <Button
                                    className="flex items-center gap-3 w-full"
                                    variant="default"
                                    onClick={() => {
                                        bongoCatRef.current?.tap();

                                        window.open(
                                            `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}`,
                                            '_blank',
                                        );
                                    }}>
                                    <ExternalLinkIcon />
                                    Invite bot
                                </Button>

                                <Button
                                    className="flex items-center gap-3 w-full"
                                    variant="outline"
                                    onClick={() => {
                                        bongoCatRef.current?.tap();

                                        router.replace('/');
                                    }}>
                                    <HomeIcon />
                                    Switch server
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
