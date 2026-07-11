import { Database } from '@shared/types';
import { EmbedBuilder } from 'discord.js';

export function formatMatchesToEmbed(matches: Database['public']['Tables']['matches']['Row'][]) {
    const embed = new EmbedBuilder().setTitle('⚽ Recent Match Results').setColor(0x0099ff).setTimestamp();

    if (matches.length === 0) {
        embed.setDescription('No matches found.');
        return embed;
    }

    matches.slice(0, 25).forEach((m) => {
        embed.addFields({
            name: `${m.first_country} vs ${m.second_country}`,
            value: `Score: **${m.first_country_score} - ${m.second_country_score}**\nDate: ${m.date}`,
            inline: true,
        });
    });

    return embed;
}
