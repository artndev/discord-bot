import * as CONSTANTS from '@/src/constants';
import { guildService } from '@/src/services';
import { SlashCommand } from '@/types';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: (() => {
        const builder = new SlashCommandBuilder()
            .setName('setting')
            .setDescription('Updates a setting')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

        for (const setting of CONSTANTS.SETTINGS_OPTIONS) {
            builder.addSubcommand((sub) => {
                sub.setName(setting.name).setDescription(setting.description);

                if (setting.type === 'boolean') {
                    sub.addBooleanOption((opt) => {
                        return opt.setName('value').setDescription('New value').setRequired(true);
                    });
                } else {
                    sub.addStringOption((opt) => {
                        return opt.setName('value').setDescription('New value').setRequired(true);
                    });
                }

                return sub;
            });
        }

        return builder;
    })(),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const setting = CONSTANTS.SETTINGS_OPTIONS.find((val) => {
            return val.name === sub;
        });

        if (!setting) {
            await interaction.reply({ content: '[❌] Unknown setting.', ephemeral: true });

            return;
        }

        const value =
            setting?.type === 'boolean'
                ? interaction.options.getBoolean('value')
                : interaction.options.getString('value');

        await interaction.deferReply({ ephemeral: true });

        try {
            await guildService.updateGuildSettings(interaction.guildId!, {
                [sub]: value,
            });

            await interaction.editReply(`Updated **${sub}** to **${value}**!`);
        } catch (error) {
            await interaction.editReply('[❌] Failed to update setting.');
        }
    },
} as SlashCommand;
