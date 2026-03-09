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

### `/create-room`

Creates a temporary voice channel under a **"Rooms"** category.

| Option | Required | Description |
|--------|----------|-------------|
| `name` | ✅ Yes | The name of the voice channel to create. |
| `icon` | ❌ No | An optional icon prepended to the channel name. |

**Available icons:**

| Key | Icon |
|-----|------|
| `gaming` | 🎮 |
| `music` | 🎵 |
| `study` | 📚 |
| `chill` | ☕ |
| `movie` | 🎬 |
| `sport` | ⚽ |
| `code` | 💻 |
| `art` | 🎨 |

**How it works:**

1. Run `/create-room name:My Room` (optionally add `icon:gaming`).
2. The bot looks for a category named **"Rooms"** in the server. If it doesn't exist, it creates one automatically.
3. A new voice channel is created under that category (e.g. `🎮 My Room`).

### 🧹 Automatic room cleanup

The bot runs a background task every **5 minutes** that checks all voice channels under the **"Rooms"** category. If a channel is found empty on **two consecutive checks** (i.e. ~10 minutes with no one in it), it is automatically deleted. This keeps your server clean from abandoned rooms.

## 📁 Project structure

```
roomy/
├── src/
│   ├── batch/
│   │   └── room-cleanup.ts  # Automatic cleanup of empty rooms
│   ├── commands/
│   │   ├── index.ts          # Command registry
│   │   ├── create-room.ts    # /create-room command
│   │   └── ping.ts           # /ping command
│   ├── config/
│   │   └── config.ts         # Environment variables loader
│   ├── deploy-commands.ts    # Slash commands deployment
│   └── index.ts              # Bot entry point
├── .env                      # Environment variables (to create)
├── .gitignore
├── CONTRIBUTING.md
├── package.json
├── roomy.service             # Systemd service file for production
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
