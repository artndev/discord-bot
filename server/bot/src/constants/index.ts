import { ZhipuParams } from '@/types';

export const SETTINGS_OPTIONS = [
    { name: 'test', description: 'Updates Test', type: 'string' },
    { name: 'test_2', description: 'Updates Test 2', type: 'boolean' },
] as const;

export const GET_ZHIPU_PARAMS = (messages: ZhipuParams['messages']): ZhipuParams => ({
    model: 'glm-4.7-flash',
    messages,
    thinking: { type: 'enabled' },
    max_tokens: 65536,
    temperature: 1.0,
});
