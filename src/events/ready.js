export function registerReady(client) {
  client.once('ready', (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}.`);
  });
}
