import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.resolve(process.cwd(), "hub-data.json");

export interface HubConfig {
    userLimit?: number;
    icon?: string;
}

interface HubData {
    hubChannels: string[];
    tempChannels: Record<string, string>;
    tempChannelOwners: Record<string, string>;
    hubConfigs: Record<string, HubConfig>;
    cleanupIntervalMs: number;
    allowedRoles: Record<string, string[]>;
    logChannels: Record<string, string>;
}

const DEFAULT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function load(): HubData {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const data = JSON.parse(raw) as HubData;
        return {
            hubChannels: Array.isArray(data.hubChannels) ? data.hubChannels : [],
            tempChannels: data.tempChannels && typeof data.tempChannels === "object" ? data.tempChannels : {},
            tempChannelOwners: data.tempChannelOwners && typeof data.tempChannelOwners === "object" ? data.tempChannelOwners : {},
            hubConfigs: data.hubConfigs && typeof data.hubConfigs === "object" ? data.hubConfigs : {},
            cleanupIntervalMs: typeof data.cleanupIntervalMs === "number" ? data.cleanupIntervalMs : DEFAULT_CLEANUP_INTERVAL_MS,
            allowedRoles: data.allowedRoles && typeof data.allowedRoles === "object" ? data.allowedRoles : {},
            logChannels: data.logChannels && typeof data.logChannels === "object" ? data.logChannels : {},
        };
    } catch {
        return { hubChannels: [], tempChannels: {}, tempChannelOwners: {}, hubConfigs: {}, cleanupIntervalMs: DEFAULT_CLEANUP_INTERVAL_MS, allowedRoles: {}, logChannels: {} };
    }
}

function save() {
    const data: HubData = {
        hubChannels: [...hubChannels],
        tempChannels: Object.fromEntries(tempChannels),
        tempChannelOwners: Object.fromEntries(tempChannelOwners),
        hubConfigs: Object.fromEntries(hubConfigs),
        cleanupIntervalMs,
        allowedRoles: Object.fromEntries(allowedRoles),
        logChannels: Object.fromEntries(logChannels),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// --- Initialize from disk ---
const initial = load();

// Set of channel IDs that are "hub" channels (➕ prefix).
export const hubChannels = new Set<string>(initial.hubChannels);

// Map of temporary channel ID → hub channel ID (parent hub that spawned it)
export const tempChannels = new Map<string, string>(Object.entries(initial.tempChannels));

// Map of user ID → temporary channel ID they own
export const tempChannelOwners = new Map<string, string>(Object.entries(initial.tempChannelOwners));

// Map of hub channel ID → configuration (user limit, icon, etc.)
export const hubConfigs = new Map<string, HubConfig>(
    Object.entries(initial.hubConfigs)
);

// Cleanup batch interval in milliseconds
export let cleanupIntervalMs: number = initial.cleanupIntervalMs;

// Map of guild ID → list of role IDs allowed to use bot commands
export const allowedRoles = new Map<string, string[]>(
    Object.entries(initial.allowedRoles)
);

// Map of guild ID → log channel ID
export const logChannels = new Map<string, string>(
    Object.entries(initial.logChannels)
);

// --- Mutation helpers that auto-persist ---

export function setCleanupInterval(ms: number) {
    cleanupIntervalMs = ms;
    save();
}

export function addAllowedRole(guildId: string, roleId: string) {
    const roles = allowedRoles.get(guildId) ?? [];
    if (!roles.includes(roleId)) {
        roles.push(roleId);
        allowedRoles.set(guildId, roles);
        save();
    }
}

export function removeAllowedRole(guildId: string, roleId: string) {
    const roles = allowedRoles.get(guildId);
    if (!roles) return;
    const idx = roles.indexOf(roleId);
    if (idx !== -1) {
        roles.splice(idx, 1);
        if (roles.length === 0) {
            allowedRoles.delete(guildId);
        } else {
            allowedRoles.set(guildId, roles);
        }
        save();
    }
}

export function getAllowedRoles(guildId: string): string[] {
    return allowedRoles.get(guildId) ?? [];
}

export function setLogChannel(guildId: string, channelId: string) {
    logChannels.set(guildId, channelId);
    save();
}

export function removeLogChannel(guildId: string) {
    logChannels.delete(guildId);
    save();
}

export function getLogChannel(guildId: string): string | undefined {
    return logChannels.get(guildId);
}

export function addHubChannel(id: string) {
    hubChannels.add(id);
    save();
}

export function removeHubChannel(id: string) {
    hubChannels.delete(id);
    hubConfigs.delete(id);
    save();
}

export function setHubConfig(hubId: string, config: HubConfig) {
    const existing = hubConfigs.get(hubId) ?? {};
    const merged: HubConfig = { ...existing, ...config };
    hubConfigs.set(hubId, merged);
    save();
}

export function addTempChannel(tempId: string, hubId: string, ownerId: string) {
    tempChannels.set(tempId, hubId);
    tempChannelOwners.set(ownerId, tempId);
    save();
}

export function removeTempChannel(tempId: string) {
    // Also remove the owner entry pointing to this channel
    for (const [userId, channelId] of tempChannelOwners) {
        if (channelId === tempId) {
            tempChannelOwners.delete(userId);
            break;
        }
    }
    tempChannels.delete(tempId);
    save();
}

