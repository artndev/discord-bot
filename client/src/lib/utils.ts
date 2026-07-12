import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => {
            return 127397 + char.charCodeAt(0);
        });

    return String.fromCodePoint(...codePoints);
}

export function inviteBot() {
    window.open(
        `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}`,
        '_blank',
    );
}
