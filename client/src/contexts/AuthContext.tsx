'use client';

import { createClient } from '@/lib/supabase/client';
import { UserIdentity } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AuthContextType {
    user: UserIdentity | null;
    setUser: (user: any | null) => void;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const [user, setUser] = useState<UserIdentity | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkForUser = async () => {
            try {
                const supabase = createClient();

                const {
                    data: { session },
                } = await supabase.auth.getSession();

                setUser(session?.user.identities?.[0] ?? null);
            } catch (err) {
                console.log('[AuthContext]', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkForUser();
    }, []);

    const signOut = useCallback(async () => {
        try {
            const supabase = createClient();

            await supabase.auth.signOut();

            setUser(null);

            router.replace('/sign-in');
        } catch (err) {
            console.log('[AuthContext]', err);
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUser, isLoading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('[AuthContext] useAuthContext must be used within an AuthProvider');
    }

    return context;
};
