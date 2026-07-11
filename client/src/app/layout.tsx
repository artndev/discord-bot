'use client';

import { ThemeProvider } from '@/components/custom/ui/theme-provider/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import './globals.css';

const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn('h-full antialiased', 'font-sans', inter.variable)} suppressHydrationWarning>
            <body className="flex flex-col h-full">
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        <AuthProvider>
                            <TooltipProvider>{children} </TooltipProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </QueryClientProvider>

                <Toaster />
            </body>
        </html>
    );
}
