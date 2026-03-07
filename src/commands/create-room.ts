import {
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

const Icons: Record<string, string> = {
    gaming: "🎮",
    music: "🎵",
    study: "📚",
    chill: "☕",
    movie: "🎬",
    sport: "⚽",
    code: "💻",
    art: "🎨",
};

const iconChoices = Object.entries(Icons).map(([key, emoji]) => ({
    name: `${emoji} ${key}`,
    value: key,
}));

export const data = new SlashCommandBuilder()
    .setName("create-room")
    .setDescription("Crée un salon vocal dans la catégorie dédiée.")
    .addStringOption((option) =>
        option
            .setName("name")
            .setDescription("Le nom du salon vocal à créer.")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("icon")
            .setDescription("Une icône optionnelle pour le salon.")
            .setRequired(false)
            .addChoices(...iconChoices)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        return interaction.reply({
            content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
            ephemeral: true,
        });
    }

    const name = interaction.options.getString("name", true);
    const iconKey = interaction.options.getString("icon");

    const channelName = iconKey ? `${Icons[iconKey]} ${name}` : name;

    // Find or create the "Rooms" category
    let category = guild.channels.cache.find(
        (ch) => ch.type === ChannelType.GuildCategory && ch.name === "Rooms"
    );

    if (!category) {
        category = await guild.channels.create({
            name: "Rooms",
            type: ChannelType.GuildCategory,
        });
    }

    const voiceChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: category!.id,
    });

    return interaction.reply({
        content: `✅ Salon vocal **${voiceChannel.name}** créé dans la catégorie **Rooms** !`,
    });
}



