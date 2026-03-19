import fs from "node:fs";
import path from "node:path";

const DATA_FILE = path.resolve(process.cwd(), "hub-data.json");

interface HubData {
    hubChannels: string[];
    tempChannels: Record<string, string>;
    tempChannelOwners: Record<string, string>;
}

function load(): HubData {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const data = JSON.parse(raw) as HubData;
        return {
            hubChannels: Array.isArray(data.hubChannels) ? data.hubChannels : [],
            tempChannels: data.tempChannels && typeof data.tempChannels === "object" ? data.tempChannels : {},
            tempChannelOwners: data.tempChannelOwners && typeof data.tempChannelOwners === "object" ? data.tempChannelOwners : {},
        };
    } catch {
        return { hubChannels: [], tempChannels: {}, tempChannelOwners: {} };
    }
}

function save() {
    const data: HubData = {
        hubChannels: [...hubChannels],
        tempChannels: Object.fromEntries(tempChannels),
        tempChannelOwners: Object.fromEntries(tempChannelOwners),
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

// --- Mutation helpers that auto-persist ---

export function addHubChannel(id: string) {
    hubChannels.add(id);
    save();
}

export function removeHubChannel(id: string) {
    hubChannels.delete(id);
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

