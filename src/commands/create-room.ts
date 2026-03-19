import {
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { addHubChannel } from "../hub-channels";

export const data = new SlashCommandBuilder()
    .setName("create-room")
    .setDescription("Crée un salon vocal hub (➕) dans une catégorie existante.")
    .addStringOption((option) =>
        option
            .setName("name")
            .setDescription("Le nom du salon vocal hub à créer.")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("category_id")
            .setDescription("L'ID de la catégorie dans laquelle créer le hub.")
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        return interaction.reply({
            content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const name = interaction.options.getString("name", true);
    const categoryId = interaction.options.getString("category_id", true);

    // Verify the category exists
    const category = guild.channels.cache.get(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
        return interaction.reply({
            content: "❌ Catégorie introuvable. Vérifie l'ID fourni.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const channelName = `➕ ${name}`;

    try {
        const voiceChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.Connect,
                    ],
                },
                {
                    id: guild.client.user!.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MoveMembers,
                    ],
                },
            ],
        });

        // Register this channel as a hub channel (persisted)
        addHubChannel(voiceChannel.id as string);

        return interaction.reply({
            content: `✅ Salon hub **${voiceChannel.name}** créé dans la catégorie **${category.name}** !\nRejoins-le pour créer un salon vocal temporaire.`,
        });
    } catch (err: any) {
        console.error(`❌ Impossible de créer le hub:`, err?.message ?? err);
        return interaction.reply({
            content: `❌ Impossible de créer le salon : ${err?.message ?? "Permissions insuffisantes."}`,
            flags: MessageFlags.Ephemeral,
        });
    }
}



