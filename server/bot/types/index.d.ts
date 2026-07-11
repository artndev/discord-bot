import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export type ZhipuParams = OpenAI.Chat.ChatCompletionCreateParams & {
    thinking?: { type: string };
};

export interface ZhipuChatCompletion {
    id: string;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
            reasoning_content?: string;
        };
        finish_reason: string;
    }[];
    usage: {
        total_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
    };
}
