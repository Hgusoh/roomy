import { Client, Snowflake, TextChannel } from "discord.js";
import { getLogChannel } from "./hub-channels";

let botClient: Client | null = null;

export function initLogger(client: Client) {
    botClient = client;
}

/**
 * Sends a log message to the configured log channel for a guild.
 * Falls back silently to console if no log channel is configured or if sending fails.
 */
export async function sendLog(guildId: string, message: string) {
    console.log(`[${guildId}] ${message}`);

    if (!botClient) return;

    const logChannelId = getLogChannel(guildId);
    if (!logChannelId) return;

    try {
        const channel = botClient.channels.cache.get(logChannelId as Snowflake) as TextChannel | undefined;
        if (channel && "send" in channel) {
            await channel.send(message);
        }
    } catch (err) {
        console.error(`❌ Impossible d'envoyer un log dans le channel ${logChannelId}:`, err);
    }
}

