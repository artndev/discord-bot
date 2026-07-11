'use client';

import * as React from 'react';

import { NavUser } from '@/components/custom/features/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useCurrentGuild } from '@/stores';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { guildId } = useCurrentGuild((state) => state);
    const pathname = usePathname();

    const segments = useMemo(() => {
        if (!pathname) {
            return [];
        }

        return (
            pathname?.split('/')?.filter((val) => {
                return val !== '';
            }) ?? []
        );
    }, [pathname]);

    const data = useMemo(() => {
        return [
            {
                title: 'Settings',
                items: [
                    {
                        title: 'General',
                        url: guildId ? `/guilds/${guildId}` : '/',
                        isActive: segments[1] === guildId && segments.length === 2,
                    },
                    {
                        title: 'Matches',
                        url: guildId ? `/guilds/${guildId}/matches` : '/',
                        isActive: segments[2] === 'matches',
                    },
                ],
            },
            {
                title: 'Other',
                items: [
                    {
                        title: 'Account',
                        url: '/account',
                        isActive: segments[0] === 'account',
                    },
                ],
            },
        ];
    }, [guildId, segments]);

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>

            <SidebarContent>
                {data.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <Link href={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
