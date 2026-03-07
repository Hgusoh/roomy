import { ChatInputCommandInteraction, Client, GatewayIntentBits } from "discord.js";
import { config } from "./config/config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { startRoomCleanupBatch } from "./batch/room-cleanup";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once("clientReady", async () => {
    console.log("Discord bot is ready! 🤖");

    // Deploy commands to all guilds the bot is already in
    for (const guild of client.guilds.cache.values()) {
        await deployCommands({ guildId: guild.id as string });
    }

    // Start the room cleanup batch (checks every 5 minutes)
    startRoomCleanupBatch(client);
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id as string });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const chatInteraction = interaction as ChatInputCommandInteraction;
    const { commandName } = chatInteraction;
    if (commands[commandName as keyof typeof commands]) {
        await commands[commandName as keyof typeof commands].execute(chatInteraction);
    }
});

client.login(config.DISCORD_TOKEN)
    .then(_ => console.log("Bot logged in"))
    .catch(e => console.error("Failed to login:", e));
