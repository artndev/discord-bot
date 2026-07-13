import { aiService, guildService } from '@/src/services';
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
        await interaction.deferReply();

        const question = interaction.options.getString('question')!;
        let aiProfile = interaction.options.getString('profile');

        if (!aiProfile) {
            try {
                if (!interaction.guildId) {
                    throw new Error('[ask_ai] Not enough permissions');
                }

                const guild = await guildService.getGuildById(interaction.guildId);

                aiProfile = guild.settings.ai_profile ?? 'default';
            } catch (error) {
                console.warn("[ask_ai] Could not parse ai_profile, resetting to 'default'");

                aiProfile = 'default';
            }
        }

        const answer = await aiService.ask(interaction.channelId, question, aiProfile as AiProfileName);
        if (!answer) {
            throw new Error('[ask_ai] Failed to process AI answer.');
        }

        const chunks = splitMessage(answer);
        await interaction.editReply(chunks[0]!);

        for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp(chunks[i]!);
        }
    },
};
