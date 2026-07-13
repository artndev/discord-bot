import { CacheType, Interaction, MessageFlags } from 'discord.js';

export default async (interaction: Interaction<CacheType>) => {
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
    } catch (err) {
        console.error(err);

        const errMessage = {
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
        } as const;

        if (interaction.deferred) {
            await interaction.editReply({ content: errMessage.content });

            return;
        } else if (interaction.replied) {
            await interaction.followUp(errMessage);

            return;
        }

        await interaction.reply(errMessage);
    }
};
