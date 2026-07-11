'use client';

import { AppSidebar } from '@/components/custom/features/app-sidebar';
import { LoadingGuard } from '@/components/custom/ui/loading-guard';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthContext } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoading } = useAuthContext();

    if (!user && !isLoading) {
        redirect('/sign-in');
    }

    return (
        <>
            <LoadingGuard isLoading={isLoading} />

            <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                    <header className="z-10 sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                        <SidebarTrigger className="-ml-1" />
                    </header>

                    <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
