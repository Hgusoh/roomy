import { Client, Snowflake, VoiceChannel } from "discord.js";
import { tempChannels, removeTempChannel } from "../hub-channels";

const CLEANUP_INTERVAL_MS = 20 * 1000; // 5 minutes

// Set of channel IDs that were empty on the previous check
const pendingDeletion = new Set<string>();

async function checkAndCleanRooms(client: Client) {
    // Only iterate over tracked temporary channels
    for (const [tempChannelId] of tempChannels) {
        const channel = client.channels.cache.get(tempChannelId as Snowflake) as VoiceChannel | undefined;

        if (!channel) {
            // Channel no longer exists, clean up tracking
            removeTempChannel(tempChannelId);
            pendingDeletion.delete(tempChannelId);
            continue;
        }

        const memberCount = channel.members.size;

        if (memberCount === 0) {
            if (pendingDeletion.has(tempChannelId)) {
                // Second consecutive check empty → delete
                try {
                    await channel.delete("Room temporaire vide depuis 2 vérifications consécutives.");
                    removeTempChannel(tempChannelId);
                    pendingDeletion.delete(tempChannelId);
                    console.log(`🗑️ Salon temporaire "${channel.name}" supprimé (vide depuis 2 checks).`);
                } catch (err) {
                    console.error(`❌ Impossible de supprimer le salon "${channel.name}":`, err);
                }
            } else {
                // First check empty → add to pending
                pendingDeletion.add(tempChannelId);
                console.log(`⏳ Salon temporaire "${channel.name}" est vide, ajouté à la file d'attente.`);
            }
        } else {
            // Channel has users → remove from pending if it was there
            if (pendingDeletion.has(tempChannelId)) {
                pendingDeletion.delete(tempChannelId);
                console.log(`✅ Salon temporaire "${channel.name}" n'est plus vide, retiré de la file d'attente.`);
            }
        }
    }

    // Clean up pending entries for channels that no longer exist
    for (const channelId of pendingDeletion) {
        if (!client.channels.cache.has(channelId as Snowflake)) {
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

