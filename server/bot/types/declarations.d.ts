import { SlashCommand } from '.';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, SlashCommand>;
    }
}
