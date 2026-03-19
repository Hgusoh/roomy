import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import { hubChannels, hubConfigs, setHubConfig, HubConfig } from "../hub-channels";

export const data = new SlashCommandBuilder()
    .setName("configure-room")
    .setDescription("Configure un salon hub existant (limite de places, icône des salons générés).")
    .addStringOption((option) =>
        option
            .setName("channel_id")
            .setDescription("L'ID du salon hub (➕) à configurer.")
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName("user_limit")
            .setDescription("Nombre max de places dans les salons temporaires créés (0 = illimité).")
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(99)
    )
    .addStringOption((option) =>
        option
            .setName("icon")
            .setDescription("Emoji affiché au début du nom des salons temporaires générés.")
            .setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        return interaction.reply({
            content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const channelId = interaction.options.getString("channel_id", true);

    // Verify the channel is a registered hub
    if (!hubChannels.has(channelId)) {
        return interaction.reply({
            content: "❌ Ce salon n'est pas un hub enregistré. Vérifie l'ID fourni.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const userLimit = interaction.options.getInteger("user_limit");
    const icon = interaction.options.getString("icon");

    // Nothing to update
    if (userLimit === null && icon === null) {
        const current = hubConfigs.get(channelId);
        const limitStr = current?.userLimit != null ? `${current.userLimit}` : "illimité";
        const iconStr = current?.icon ?? "🔊";
        return interaction.reply({
            content: `ℹ️ Configuration actuelle du hub :\n• Limite de places : **${limitStr}**\n• Icône : **${iconStr}**`,
            flags: MessageFlags.Ephemeral,
        });
    }

    const update: HubConfig = {};
    if (userLimit !== null) update.userLimit = userLimit;
    if (icon !== null) update.icon = icon;

    setHubConfig(channelId, update);

    const parts: string[] = [];
    if (userLimit !== null) parts.push(`Limite de places → **${userLimit === 0 ? "illimité" : userLimit}**`);
    if (icon !== null) parts.push(`Icône → **${icon}**`);

    return interaction.reply({
        content: `✅ Hub configuré !\n${parts.join("\n")}`,
    });
}

