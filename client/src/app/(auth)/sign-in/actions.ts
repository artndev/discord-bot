'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function handleDiscord() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_URL}/api/auth/discord-callback`,
        },
    });
    if (error) {
        redirect('/auth/auth-code-error');
    }

    redirect(data.url);
}
