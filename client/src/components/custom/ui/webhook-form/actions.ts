import { globalApiClient } from '@/lib/axios';
import axios from 'axios';

export async function validateDiscordWebhook(webhookUrl: string) {
    try {
        await globalApiClient.get(webhookUrl);

        return { ok: true };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 404) {
                return { ok: false, err: 'Webhook URL not found. Please check the URL.' };
            }

            return { ok: false, err: `Discord returned error: ${status || 'Unknown'}` };
        }

        return { ok: false, err: 'Could not connect to Discord. Please check your internet connection.' };
    }
}
