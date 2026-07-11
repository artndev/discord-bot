import { CacheType, Interaction, MessageFlags } from 'discord.js';

export default async (interaction: Interaction<CacheType>) => {
    // if (interaction.isAutocomplete()) {
    //     if (interaction.commandName === 'settings') {
    //         const focused = interaction.options.getFocused();
    //         const filtered = CONSTANTS.SETTINGS_OPTIONS.filter((option) => {
    //             return option.startsWith(focused);
    //         });

    //         await interaction.respond(
    //             filtered.map((option) => {
    //                 return { name: option, value: option };
    //             }),
    //         );
    //     }

    //     return;
    // }

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });

            return;
        }

        await interaction.reply({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
        });
    }
};
