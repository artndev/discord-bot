import { globalApiClient } from './axios';

export async function sendDiscordWebhook(url: string, content: string) {
    const response = await globalApiClient.post(url, {
        method: 'POST',
        body: JSON.stringify({ content }),
    });

    if (response.status !== 200) {
        throw new Error(`[webhook] Failed to send webhook: ${response.statusText}`);
    }

    return response;
}
