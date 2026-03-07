import { ChannelType, Client, VoiceChannel } from "discord.js";

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Set of channel IDs that were empty on the previous check
const pendingDeletion = new Set<string>();

async function checkAndCleanRooms(client: Client) {
    for (const guild of client.guilds.cache.values()) {
        // Find the "Rooms" category
        const category = guild.channels.cache.find(
            (ch) => ch.type === ChannelType.GuildCategory && ch.name === "Rooms"
        );

        if (!category) continue;

        // Get all voice channels under the "Rooms" category
        const voiceChannels = guild.channels.cache.filter(
            (ch): ch is VoiceChannel =>
                ch.type === ChannelType.GuildVoice && ch.parentId === category.id
        );

        for (const [channelId, channel] of voiceChannels) {
            const id = channelId as string;
            const memberCount = channel.members.size;

            if (memberCount === 0) {
                if (pendingDeletion.has(id)) {
                    // Second consecutive check empty → delete
                    try {
                        await channel.delete("Room vide depuis 2 vérifications consécutives.");
                        pendingDeletion.delete(id);
                        console.log(`🗑️ Salon "${channel.name}" supprimé (vide depuis 2 checks).`);
                    } catch (err) {
                        console.error(`❌ Impossible de supprimer le salon "${channel.name}":`, err);
                    }
                } else {
                    // First check empty → add to pending
                    pendingDeletion.add(id);
                    console.log(`⏳ Salon "${channel.name}" est vide, ajouté à la file d'attente.`);
                }
            } else {
                // Channel has users → remove from pending if it was there
                if (pendingDeletion.has(id)) {
                    pendingDeletion.delete(id);
                    console.log(`✅ Salon "${channel.name}" n'est plus vide, retiré de la file d'attente.`);
                }
            }
        }
    }

    // Clean up pending entries for channels that no longer exist
    for (const channelId of pendingDeletion) {
        if (!client.channels.cache.find((ch) => ch.id === channelId)) {
            pendingDeletion.delete(channelId);
        }
    }
}

export function startRoomCleanupBatch(client: Client) {
    console.log(`🔄 Batch de nettoyage des rooms démarré (intervalle: ${CLEANUP_INTERVAL_MS / 1000}s).`);

    setInterval(() => {
        checkAndCleanRooms(client).catch((err) =>
            console.error("❌ Erreur dans le batch de nettoyage:", err)
        );
    }, CLEANUP_INTERVAL_MS);
}

