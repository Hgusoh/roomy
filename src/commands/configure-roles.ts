import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { addAllowedRole, removeAllowedRole, getAllowedRoles } from "../hub-channels";

export const data = new SlashCommandBuilder()
    .setName("configure-roles")
    .setDescription("Définit les rôles autorisés à utiliser les commandes du bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
        sub
            .setName("add")
            .setDescription("Ajoute un rôle autorisé.")
            .addRoleOption((option) =>
                option
                    .setName("role")
                    .setDescription("Le rôle à autoriser.")
                    .setRequired(true)
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("remove")
            .setDescription("Retire un rôle autorisé.")
            .addRoleOption((option) =>
                option
                    .setName("role")
                    .setDescription("Le rôle à retirer.")
                    .setRequired(true)
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("list")
            .setDescription("Affiche les rôles actuellement autorisés.")
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        return interaction.reply({
            content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = guild.id as string;

    if (subcommand === "add") {
        const role = interaction.options.getRole("role", true);
        const roleId = String(role.id);
        const roleName = String(role.name);
        addAllowedRole(guildId, roleId);
        return interaction.reply({
            content: `✅ Le rôle **${roleName}** a été ajouté aux rôles autorisés.`,
        });
    }

    if (subcommand === "remove") {
        const role = interaction.options.getRole("role", true);
        const roleId = String(role.id);
        const roleName = String(role.name);
        removeAllowedRole(guildId, roleId);
        return interaction.reply({
            content: `✅ Le rôle **${roleName}** a été retiré des rôles autorisés.`,
        });
    }

    if (subcommand === "list") {
        const roles = getAllowedRoles(guildId);
        if (roles.length === 0) {
            return interaction.reply({
                content: "ℹ️ Aucun rôle configuré — seuls les **administrateurs** peuvent utiliser les commandes.",
                flags: MessageFlags.Ephemeral,
            });
        }
        const roleList = roles.map((id) => `• <@&${id}>`).join("\n");
        return interaction.reply({
            content: `ℹ️ Rôles autorisés :\n${roleList}\n\n_Les administrateurs ont toujours accès._`,
            flags: MessageFlags.Ephemeral,
        });
    }
}


