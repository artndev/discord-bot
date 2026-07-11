import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { GoogleGenAI } from '@google/genai';
import { AI_PROFILES } from '@shared/constants';
import { messageSchema } from '@shared/schemas';
import { AiProfileName } from '@shared/types';
import { Database } from '@shared/types/database.types';
import z from 'zod';
import { apiClient } from './axios';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const ask = async (
    channelId: string,
    message: string,
    profileName: AiProfileName = 'default',
    additionalContext?: string,
) => {
    const response = await apiClient.get<{ history: Database['public']['Tables']['ai_chat_history']['Row'][] }>(
        `/ai_chat_history/${channelId}`,
    );
    const history = response.data.history.map(({ role, content }) => ({
        role: role as z.infer<typeof messageSchema>['role'],
        parts: [{ text: content }],
    }));

    const { text } = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: { systemInstruction: `${AI_PROFILES[profileName]}\n${additionalContext ?? ''}` },
    });

    await Promise.all([
        apiClient.post('/ai_chat_history', {
            channel_id: channelId,
            role: 'user',
            content: message,
        }),
        apiClient.post('/ai_chat_history', {
            channel_id: channelId,
            role: 'model',
            content: text,
        }),
    ]);

    return text;
};
