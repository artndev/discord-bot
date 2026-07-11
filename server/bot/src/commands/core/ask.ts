import { aiService } from '@/src/services';
import { splitMessage } from '@/src/utils';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the AI a question')
        .addStringOption((option) =>
            option.setName('question').setDescription('What would you like to ask?').setRequired(true),
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const question = interaction.options.getString('question')!;

        await interaction.deferReply();

        try {
            const answer = await aiService.ask(interaction.channelId, question);

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
