import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { liftsPool } from './database/lifts.js';
import { trainsPool } from './database/trains.js';
import { loadCommands } from './commands/loader.js';
import { registerInteractionCreate } from './events/interactionCreate.js';
import { registerReady } from './events/ready.js';

if (!process.env.DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is not configured.');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

registerReady(client);
registerInteractionCreate(client, await loadCommands());

async function shutdown(signal) {
  console.log(`Received ${signal}; closing database pools.`);
  await Promise.allSettled([liftsPool.end(), trainsPool.end()]);
  client.destroy();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    shutdown(signal)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Shutdown failed:', error);
        process.exit(1);
      });
  });
}

await client.login(process.env.DISCORD_TOKEN);
