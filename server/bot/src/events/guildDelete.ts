import { Guild } from 'discord.js';
import { guildService } from '../services';

export default async (guild: Guild) => {
    await guildService.deleteGuild(guild.id);
};
