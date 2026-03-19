import { ChannelType, ChatInputCommandInteraction, Client, GatewayIntentBits, MessageFlags, Snowflake } from "discord.js";
import { config } from "./config/config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { startRoomCleanupBatch } from "./batch/room-cleanup";
import { hubChannels, hubConfigs, tempChannelOwners, addTempChannel } from "./hub-channels";
import { hasCommandAccess } from "./guards";

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

    // Permission check (configure-roles is admin-only via Discord permissions, skip guard)
    if (commandName !== "configure-roles") {
        const member = chatInteraction.member as import("discord.js").GuildMember | null;
        if (member && !hasCommandAccess(member)) {
            await chatInteraction.reply({
                content: "❌ Tu n'as pas la permission d'utiliser cette commande.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
    }

    if (commands[commandName as keyof typeof commands]) {
        await commands[commandName as keyof typeof commands].execute(chatInteraction);
    }
});

// When a user joins a hub channel (➕), create a temporary voice channel and move them
client.on("voiceStateUpdate", async (oldState, newState) => {
    const channelId = newState.channelId;
    if (!channelId || !hubChannels.has(channelId as string)) return;

    const guild = newState.guild;
    const member = newState.member;
    if (!member) return;

    const hubChannel = guild.channels.cache.get(channelId);
    if (!hubChannel) return;

    // Check if this user already owns an active temp channel
    const existingTempId = tempChannelOwners.get(member.id as string);
    if (existingTempId) {
        const existingChannel = guild.channels.cache.get(existingTempId as Snowflake);
        if (existingChannel) {
            // Move user to their existing temp channel instead of creating a new one
            try {
                await member.voice.setChannel(existingChannel.id);
                console.log(`↩️ ${member.displayName} a déjà un salon actif, déplacé vers "${existingChannel.name}".`);
            } catch (err) {
                console.error(`❌ Impossible de déplacer ${member.displayName} vers son salon existant:`, err);
            }
            return;
        }
    }

    // Derive temp channel name from hub channel name (remove ➕ prefix)
    const baseName = hubChannel.name.replace(/^➕*/, "");
    const config = hubConfigs.get(channelId as string);
    const icon = config?.icon ?? "🔊";
    const tempName = `${icon} ${baseName} — ${member.displayName}`;

    try {
        const tempChannel = await guild.channels.create({
            name: tempName,
            type: ChannelType.GuildVoice,
            parent: hubChannel.parentId ?? undefined,
            userLimit: config?.userLimit ?? 0,
        });

        // Track this temporary channel (persisted)
        addTempChannel(tempChannel.id as string, channelId as string, member.id as string);

        // Move the member to the new temp channel
        await member.voice.setChannel(tempChannel);
        console.log(`🔊 Salon temporaire "${tempChannel.name}" créé pour ${member.displayName}.`);
    } catch (err) {
        console.error(`❌ Impossible de créer un salon temporaire pour ${member.displayName}:`, err);
    }
});

client.login(config.DISCORD_TOKEN)
    .then(_ => console.log("Bot logged in"))
    .catch(e => console.error("Failed to login:", e));
