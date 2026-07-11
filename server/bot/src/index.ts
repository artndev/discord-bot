import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { SlashCommand } from '@/types';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { onClientReady, onGuildCreate, onGuildDelete, onInteractionCreate } from './events';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

client.commands = new Collection();

client.once(Events.ClientReady, onClientReady);

client.on(Events.InteractionCreate, onInteractionCreate);

client.on(Events.GuildCreate, onGuildCreate);

client.on(Events.GuildDelete, onGuildDelete);

client.on(Events.Error, (err) => {
    console.warn('[bot/index.ts]', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.warn('[bot/index.ts]', promise, 'with reason:', reason);
});

const loadCommands = async () => {
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
            return file.endsWith('.ts');
        });

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);

            const module = await import(pathToFileURL(filePath).href);
            const command = module.default as SlashCommand;

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.warn(
                    `[warning] The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
            }
        }
    }
};

const deployCommands = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        const formattedCommands = client.commands.map((command: SlashCommand) => {
            return command.data.toJSON();
        });

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
            body: formattedCommands,
        });

        console.log(`Successfully reloaded application ${formattedCommands.length} (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};

const main = async () => {
    await loadCommands();

    await deployCommands();

    await client.login(process.env.BOT_TOKEN);
};

main();
