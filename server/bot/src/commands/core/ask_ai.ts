import { aiService } from '@/src/services';
import { splitMessage } from '@/src/utils';
import { AiProfileName } from '@shared/types';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ai_ask')
        .setDescription('Ask the AI a question')
        .addStringOption((option) =>
            option.setName('question').setDescription('What would you like to ask?').setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('profile')
                .setDescription('Choose the AI personality')
                .addChoices(
                    { name: 'Default', value: 'default' },
                    { name: 'Manager', value: 'manager' },
                    { name: 'Ultra Fan', value: 'ultra' },
                    { name: 'Analyst', value: 'analyst' },
                    { name: 'Pundit', value: 'pundit' },
                ),
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const question = interaction.options.getString('question')!;
        const aiProfile = interaction.options.getString('profile') ?? 'default';

        await interaction.deferReply();

        try {
            const answer = await aiService.ask(interaction.channelId, question, aiProfile as AiProfileName);
            if (!answer) {
                throw new Error('[ask] Failed to process AI answer.');
            }

            const chunks = splitMessage(answer);
            await interaction.editReply(chunks[0]!);

            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp(chunks[i]!);
            }
        } catch (err) {
            console.warn(err);

            await interaction.editReply('[❌] Failed to generate an AI response.');
        }
    },
};
