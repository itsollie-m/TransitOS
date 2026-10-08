import { ContainerBuilder, MessageFlags, SeparatorBuilder, TextDisplayBuilder } from 'discord.js';
import { liftsPool } from '../database/lifts.js';
import { trainsPool } from '../database/trains.js';

async function checkDatabase(pool) {
  const startedAt = performance.now();

  try {
    await pool.query('SELECT 1');
    return {
      connected: true,
      latency: Math.round(performance.now() - startedAt),
    };
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return {
      connected: false,
      latency: null,
    };
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function databaseStatusLine(label, result) {
  return result.connected
    ? `🟢 ${label}\nConnected`
    : `🔴 ${label}\nDisconnected`;
}

function databaseLatencyLine(label, result) {
  return result.connected ? `${label}    ${result.latency}ms` : `${label}    —`;
}

export const data = {
  name: 'status',
  description: 'Show TransitOS service and runtime status.',
  async execute(interaction) {
    const [lifts, trains] = await Promise.all([
      checkDatabase(liftsPool),
      checkDatabase(trainsPool),
    ]);

    const discordLatency = interaction.client.ws.ping;
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# TransitOS\n## System status'),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### Services\n🟢 Discord\n${discordLatency >= 0 ? 'Connected' : '🔴 Discord\nDisconnected'}\n\n${databaseStatusLine('Lifts database', lifts)}\n\n${databaseStatusLine('Trains database', trains)}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### Performance\nWebSocket    ${discordLatency >= 0 ? `${discordLatency}ms` : '—'}\n${databaseLatencyLine('Lifts DB', lifts)}\n${databaseLatencyLine('Trains DB', trains)}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### Runtime\nNode.js    ${process.version}\nUptime    ${formatUptime(process.uptime())}`,
        ),
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};
