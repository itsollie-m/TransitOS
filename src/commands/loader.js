import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { Collection } from 'discord.js';

const commandsDirectory = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands() {
  const commands = new Collection();
  const commandFiles = (await readdir(commandsDirectory))
    .filter((fileName) => fileName.endsWith('.js') && fileName !== 'loader.js')
    .sort();

  for (const fileName of commandFiles) {
    const commandPath = pathToFileURL(path.join(commandsDirectory, fileName)).href;
    const { data } = await import(commandPath);

    if (!data?.name || typeof data.execute !== 'function') {
      throw new Error(`Invalid command module: ${fileName}`);
    }

    commands.set(data.name, data);
  }

  return commands;
}
