# 🤖 Roomy

A Discord bot that manages temporary voice channels (rooms).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) version 18.x or higher
- [npm](https://www.npmjs.com/)
- A [Discord Developer](https://discord.com/developers/applications) account

## 🚀 Installation

### 1. Clone the project

```bash
git clone https://github.com/Hgusoh/roomy.git
cd roomy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

Create a `.env` file at the project root with the following variables:

```env
DISCORD_TOKEN=your_discord_token
DISCORD_CLIENT_ID=your_client_id
```

**How to get these values:**

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. **DISCORD_CLIENT_ID**: Found in the "General Information" tab → "Application ID"
4. **DISCORD_TOKEN**: Go to the "Bot" tab → Click "Reset Token" to get your token

**⚠️ Important:** Never share your token! Keep your `.env` file secret.

### 4. Invite the bot to your server

Generate an invitation link:

1. In the [Discord Developer Portal](https://discord.com/developers/applications)
2. Go to "OAuth2" → "URL Generator"
3. Select scopes: `bot`, `applications.commands`
4. Select the required permissions (Manage Channels, Connect, etc.)
5. Copy the generated URL and open it in your browser

## 🎮 Usage

### Development mode

Starts the bot with hot-reload on file changes:

```bash
npm run dev
```

### Build

Compiles the TypeScript project:

```bash
npm run build
```

### Production

Runs the bot in production (requires building first):

```bash
npm run build
npm start
```

## 🤖 Commands

### `/ping`

A simple health-check command. Replies with **Pong!**

---

### `/create-room`

Creates a **hub voice channel** (prefixed with ➕) inside an existing category. When a user joins this hub channel, a temporary voice channel is automatically created and the user is moved into it.

| Option | Required | Description |
|--------|----------|-------------|
| `name` | ✅ Yes | The name of the hub voice channel. |
| `category_id` | ✅ Yes | The ID of the category in which the hub will be created. |

**How it works:**

1. Run `/create-room name:Gaming category_id:123456789`.
2. A voice channel named **➕ Gaming** is created in the specified category.
3. When a user joins this channel, the bot creates a temporary voice channel (e.g. `🔊 Gaming — Username`) and moves the user into it.
4. Each user can only own **one** active temporary channel at a time. If they rejoin the hub, they are moved back to their existing channel.

---

### `/configure-room`

Configures an existing hub channel (icon and user limit for the generated temporary channels).

| Option | Required | Description |
|--------|----------|-------------|
| `channel_id` | ✅ Yes | The ID of the hub channel (➕) to configure. |
| `user_limit` | ❌ No | Max number of users in generated temp channels (0 = unlimited, max 99). |
| `icon` | ❌ No | Emoji displayed at the beginning of generated temp channel names. |

> 💡 If no optional parameter is provided, the command displays the current configuration.

---

### `/configure-batch` 🔒

*Administrator only* — Configures the interval of the automatic cleanup batch.

| Option | Required | Description |
|--------|----------|-------------|
| `interval` | ❌ No | Interval in seconds between each cleanup check (10–3600). |

> 💡 If no parameter is provided, the command displays the current interval. Default: **300s** (5 minutes).

---

### `/configure-roles` 🔒

*Administrator only* — Defines which roles are allowed to use the bot commands. By default, only administrators can use commands.

| Subcommand | Description |
|------------|-------------|
| `add role:@Role` | Adds a role to the allowed list. |
| `remove role:@Role` | Removes a role from the allowed list. |
| `list` | Displays the currently allowed roles. |

> 💡 Administrators always have access regardless of the configured roles.

---

### 🔐 Permissions

By default, only **server administrators** can use the bot commands. Use `/configure-roles add` to grant access to additional roles. The `/configure-roles` and `/configure-batch` commands remain admin-only.

### 🧹 Automatic room cleanup

The bot runs a background task (configurable via `/configure-batch`) that checks all **temporary** voice channels. If a channel is found empty on **two consecutive checks**, it is automatically deleted. Hub channels (➕) are never deleted. All configuration is persisted to disk and survives bot restarts.

## 📁 Project structure

```
roomy/
├── src/
│   ├── batch/
│   │   └── room-cleanup.ts       # Automatic cleanup of empty temp channels
│   ├── commands/
│   │   ├── index.ts               # Command registry
│   │   ├── create-room.ts         # /create-room command
│   │   ├── configure-room.ts      # /configure-room command
│   │   ├── configure-batch.ts     # /configure-batch command (admin)
│   │   ├── configure-roles.ts     # /configure-roles command (admin)
│   │   └── ping.ts                # /ping command
│   ├── config/
│   │   └── config.ts              # Environment variables loader
│   ├── deploy-commands.ts         # Slash commands deployment
│   ├── guards.ts                  # Permission checks (role-based access)
│   ├── hub-channels.ts            # Persistent store (hubs, temp channels, config)
│   └── index.ts                   # Bot entry point
├── hub-data.json                  # Runtime data (auto-generated, gitignored)
├── .env                           # Environment variables (to create)
├── .gitignore
├── CONTRIBUTING.md
├── package.json
├── roomy.service                  # Systemd service file for production
├── tsconfig.json
└── README.md
```

## 🛠️ Tech stack

- [Discord.js](https://discord.js.org/) v14 — Discord API library
- [TypeScript](https://www.typescriptlang.org/) — Static typing
- [tsx](https://github.com/privatenumber/tsx) — TypeScript runner for development
- [tsup](https://tsup.egoist.dev/) — Fast TypeScript bundler
- [dotenv](https://github.com/motdotla/dotenv) — Environment variable management

## 📝 Adding a new command

1. Create a new file in `src/commands/` (e.g. `my-command.ts`)
2. Export your command with the following structure:

```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("my-command")
    .setDescription("Description of my command");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Command response");
}
```

3. Register your command in `src/commands/index.ts`

## 🐛 Troubleshooting

### The bot won't connect

- Check that your `DISCORD_TOKEN` is correct in the `.env` file
- Make sure the bot is enabled in the Discord Developer Portal

### Slash commands don't show up

- Commands are deployed automatically when the bot starts and when it joins a server
- It may take a few minutes for Discord to sync them

## 📄 License

ISC

## 👤 Author

Hugo Helluy

## 🔗 Links

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
