import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { cleanupIntervalMs, setCleanupInterval } from "../hub-channels";
import { restartRoomCleanupBatch } from "../batch/room-cleanup";

export const data = new SlashCommandBuilder()
    .setName("configure-batch")
    .setDescription("Configure l'intervalle du batch de nettoyage des salons temporaires.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
        option
            .setName("interval")
            .setDescription("Intervalle en secondes entre chaque vérification.")
            .setRequired(false)
            .setMinValue(10)
            .setMaxValue(3600)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        return interaction.reply({
            content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const interval = interaction.options.getInteger("interval");

    // No parameter → show current config
    if (interval === null) {
        return interaction.reply({
            content: `ℹ️ Intervalle actuel du batch de nettoyage : **${cleanupIntervalMs / 1000}s**`,
            flags: MessageFlags.Ephemeral,
        });
    }

    const newIntervalMs = interval * 1000;
    setCleanupInterval(newIntervalMs);
    restartRoomCleanupBatch();

    return interaction.reply({
        content: `✅ Intervalle du batch mis à jour à **${interval}s** et redémarré.`,
    });
}

