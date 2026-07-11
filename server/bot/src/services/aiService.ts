import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as CONSTANTS from '@/src/constants';
import { ZhipuChatCompletion } from '@/types';
import OpenAI from 'openai';
import { apiClient } from './axios';

const client = new OpenAI({
    apiKey: process.env.GLM_API_KEY,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
});

export const ask = async (channelId: string, message: string) => {
    const response = await apiClient.get(`/ai_chat_history/${channelId}`);

    const answer = (await client.chat.completions.create(
        CONSTANTS.GET_ZHIPU_PARAMS([
            {
                role: 'system',
                content:
                    'Keep your response concise. If your answer is very long, structure it clearly with headings. Do not exceed 1800 characters!',
            },
            ...response.data.history,
            { role: 'system', content: 'End of history. User is currently saying:' },
            {
                role: 'user',
                content: message,
            },
        ]),
    )) as ZhipuChatCompletion;

    const content = answer.choices[0]?.message.content;
    if (!content) {
        throw new Error('[aiService] Received invalid content');
    }

    await apiClient.post('/ai_chat_history', {
        channel_id: channelId,
        role: 'user',
        content: message,
    });

    await apiClient.post('/ai_chat_history', {
        channel_id: channelId,
        role: 'assistant',
        content,
    });

    return content;
};
