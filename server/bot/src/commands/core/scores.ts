import { aiService, guildService, matchService } from '@/src/services';
import { splitMessage } from '@/src/utils';
import { formatMatchesToEmbed } from '@/src/utils/formatters';
import { AiProfileName } from '@shared/types';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('scores')
        .setDescription('Get the latest news of scores')
        .addBooleanOption((option) => option.setName('summarize').setDescription('Get an AI summary of these scores?'))
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
        const summarize = interaction.options.getBoolean('summarize') ?? false;
        let aiProfile = interaction.options.getString('profile');

        await interaction.deferReply();

        try {
            if (!interaction.guildId) {
                throw new Error('[scores] Not enough permissions');
            }

            const matches = await matchService.getAllMatches(interaction.guildId);
            const embed = formatMatchesToEmbed(matches);

            await interaction.editReply({ embeds: [embed] });

            if (summarize) {
                if (!aiProfile) {
                    try {
                        const guild = await guildService.getGuildById(interaction.guildId);

                        aiProfile = guild.settings.ai_profile ?? 'default';
                    } catch (error) {
                        console.warn("[scores] Could not parse ai_profile, resetting to 'default'");

                        aiProfile = 'default';
                    }
                }

                const additionalContext = matches
                    .map((match) => {
                        return `${match.date}: ${match.first_country} ${match.first_country_score} - ${match.second_country_score} ${match.second_country}`;
                    })
                    .join('\n');

                const summary = await aiService.ask(
                    interaction.channelId,
                    'Provide a brief summary and tactical analysis of these recent match results.',
                    aiProfile as AiProfileName,
                    additionalContext,
                );
                if (!summary) {
                    console.warn('[scores] Failed to process AI summary.');

                    await interaction.followUp({
                        content: '[❌] Could not generate AI summary.',
                        flags: ['Ephemeral'],
                    });

                    return;
                }

                const chunks = splitMessage(summary);
                await interaction.followUp(chunks[0]!);

                for (let i = 1; i < chunks.length; i++) {
                    await interaction.followUp(chunks[i]!);
                }
            }
        } catch (err) {
            console.warn(err);

            await interaction.editReply('[❌] Failed to fetch scores.');
        }
    },
};
