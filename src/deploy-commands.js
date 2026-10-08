import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './commands/loader.js';

const requiredVariables = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not configured.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const commands = await loadCommands();

await rest.put(
  Routes.applicationGuildCommands(
    process.env.DISCORD_CLIENT_ID,
    process.env.DISCORD_GUILD_ID,
  ),
  { body: [...commands.values()] },
);

console.log('Successfully deployed guild commands.');
