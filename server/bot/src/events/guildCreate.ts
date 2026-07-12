import { AuditLogEvent, Guild } from 'discord.js';
import { guildService } from '../services';

export default async (guild: Guild) => {
    let ownerId = guild.ownerId;

    try {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
        });
        const botAddLog = fetchedLogs.entries.first();

        ownerId = botAddLog?.executor?.id ?? guild.ownerId;
    } catch (err) {}

    await guildService.registerGuild(guild.id, guild.name, ownerId, guild.icon);
};
