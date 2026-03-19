import {
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    Snowflake,
} from "discord.js";
import { getLogChannel, setLogChannel, removeLogChannel } from "../hub-channels";

export const data = new SlashCommandBuilder()
    .setName("configure-logs")
    .setDescription("Configure le channel de log du bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName("channel_id")
            .setDescription("L'ID du channel textuel pour les logs. Laisser vide pour voir/désactiver.")
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName("disable")
            .setDescription("Désactiver les logs pour ce serveur.")
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

    const guildId = guild.id as string;
    const channelId = interaction.options.getString("channel_id");
    const disable = interaction.options.getBoolean("disable");

    // Disable logs
    if (disable) {
        removeLogChannel(guildId);
        return interaction.reply({
            content: "✅ Les logs ont été désactivés pour ce serveur.",
        });
    }

    // No channel_id → show current config
    if (!channelId) {
        const current = getLogChannel(guildId);
        if (current) {
            return interaction.reply({
                content: `ℹ️ Channel de log actuel : <#${current}>`,
                flags: MessageFlags.Ephemeral,
            });
        }
        return interaction.reply({
            content: "ℹ️ Aucun channel de log configuré.",
            flags: MessageFlags.Ephemeral,
        });
    }

    // Verify the channel exists and is a text channel
    const channel = guild.channels.cache.get(channelId as Snowflake);
    if (!channel || channel.type !== ChannelType.GuildText) {
        return interaction.reply({
            content: "❌ Channel textuel introuvable. Vérifie l'ID fourni.",
            flags: MessageFlags.Ephemeral,
        });
    }

    setLogChannel(guildId, channelId);

    return interaction.reply({
        content: `✅ Channel de log configuré : <#${channelId}>`,
    });
}



