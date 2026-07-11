'use client';

import { ChevronsUpDown, LogOut, UserRound } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function NavUser() {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const { user, signOut } = useAuthContext();

    if (!user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-Na[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.identity_data?.full_name}</span>
                                <span className="truncate text-xs">{user.identity_data?.email}</span>
                            </div>

                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className={cn(
                            'w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg overflow-hidden',
                            !isMobile && 'mt-2.5',
                        )}
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={20}>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => router.push('/account')}>
                                <UserRound />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={signOut}>
                                <LogOut />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
