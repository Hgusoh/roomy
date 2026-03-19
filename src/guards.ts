import { GuildMember, PermissionFlagsBits, Snowflake } from "discord.js";
import { getAllowedRoles } from "./hub-channels";

/**
 * Checks whether a guild member is allowed to use bot commands.
 * A member is allowed if:
 *   - They have the Administrator permission, OR
 *   - No allowed roles are configured for the guild (defaults to admin-only), OR
 *   - They have at least one of the configured allowed roles.
 */
export function hasCommandAccess(member: GuildMember): boolean {
    // Administrators always have access
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
        return true;
    }

    const roles = getAllowedRoles(member.guild.id as string);

    // No roles configured → admin-only
    if (roles.length === 0) {
        return false;
    }

    // Check if the member has at least one allowed role
    return roles.some((roleId) => member.roles.cache.has(roleId as Snowflake));
}


