import { Client, Events, GatewayIntentBits, Message } from "discord.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("Error: DISCORD_TOKEN environment variable is not set.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message: Message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "ping") {
    message.reply("pong").catch((err) => {
      console.error("Failed to reply to ping:", err);
    });
  }
});

client.login(token);
