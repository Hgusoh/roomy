# roomy

A Discord bot that responds **pong** when you say **ping**.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Discord bot token](https://discord.com/developers/applications)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hgusoh/roomy.git
   cd roomy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your Discord bot token:

   ```env
   DISCORD_TOKEN=your_bot_token_here
   ```

## Running the bot

### Development (using `ts-node`, no build step required)

```bash
DISCORD_TOKEN=your_bot_token_here npm run dev
```

Or if you have a `.env` file and a tool like [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli):

```bash
npx dotenv -e .env npm run dev
```

### Production (compile then run)

1. Build the TypeScript source:

   ```bash
   npm run build
   ```

2. Start the compiled bot:

   ```bash
   DISCORD_TOKEN=your_bot_token_here npm start
   ```

## Usage

Once the bot is running and added to your server, type **ping** in any channel the bot has access to — it will reply with **pong**.

## Required bot permissions

When inviting the bot to your server, make sure to enable the following:

- **Scopes**: `bot`
- **Bot Permissions**: `Send Messages`, `Read Message History`
- **Privileged Gateway Intents**: `Message Content Intent` (enable in the Discord Developer Portal under your application → Bot)
