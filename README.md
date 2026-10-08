# TransitOS

TransitOS is a Discord bot foundation for managing lift and train documentation, filming sessions, footage, YouTube content, publishing schedules, and analytics.

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create `.env` from `.env.example`.
3. Add the Discord bot token, application client ID, and target guild ID.
4. Set `LIFTS_JDBC_CONNECTION_STRING` to the JDBC connection string for `s35_lifts`.
5. Set `TRAINS_JDBC_CONNECTION_STRING` to the JDBC connection string for `s35_trains`.
6. Deploy the guild slash command:

   ```sh
   npm run deploy
   ```

7. Start the bot:

   ```sh
   npm start
   ```

8. Use `/status` in the configured Discord guild to check Discord latency, both database connections, query timings, Node.js, and uptime.

The bot uses separate MySQL connection pools for `s35_lifts` and `s35_trains`. It does not create or modify database schemas.

All user-facing Discord UI uses Discord Components V2. Traditional embeds and embed accent colours are intentionally not used.
