# 🤖 Roomy
Un bot Discord qui gère des salons (rooms).
## 📋 Prérequis
- [Node.js](https://nodejs.org/) version 18.x ou supérieure
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un compte [Discord Developer](https://discord.com/developers/applications)
## 🚀 Installation
### 1. Cloner le projet
```bash
git clone https://github.com/Hgusoh/roomy.git
cd roomy
```
### 2. Installer les dépendances
```bash
npm install
```
### 3. Configuration
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
DISCORD_TOKEN=votre_token_discord
DISCORD_CLIENT_ID=votre_client_id
```
**Comment obtenir ces valeurs :**
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application ou sélectionnez-en une existante
3. **DISCORD_CLIENT_ID** : Trouvez-le dans l'onglet "General Information" → "Application ID"
4. **DISCORD_TOKEN** : Allez dans l'onglet "Bot" → Cliquez sur "Reset Token" pour obtenir votre token
**⚠️ Important :** Ne partagez jamais votre token ! Gardez votre fichier `.env` secret.
### 4. Inviter le bot sur votre serveur
Générez un lien d'invitation :
1. Dans le [Discord Developer Portal](https://discord.com/developers/applications)
2. Allez dans "OAuth2" → "URL Generator"
3. Sélectionnez les scopes : `bot`, `applications.commands`
4. Sélectionnez les permissions nécessaires
5. Copiez l'URL générée et ouvrez-la dans votre navigateur
## 🎮 Utilisation
### Mode développement
Lance le bot avec rechargement automatique lors des modifications :
```bash
npm run dev
```
### Build
Compile le projet TypeScript :
```bash
npm run build
```
### Production
Lance le bot en production (nécessite d'avoir build avant) :
```bash
npm run build
npm start
```
## 📁 Structure du projet
```
roomy/
├── src/
│   ├── commands/          # Commandes du bot
│   │   ├── index.ts       # Export des commandes
│   │   └── ping.ts        # Exemple de commande
│   ├── config/            # Configuration
│   │   └── config.ts      # Chargement des variables d'env
│   ├── deploy-commands.ts # Déploiement des commandes slash
│   └── index.ts           # Point d'entrée du bot
├── .env                   # Variables d'environnement (à créer)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
## 🛠️ Technologies utilisées
- [Discord.js](https://discord.js.org/) v14.25.1 - Bibliothèque pour interagir avec l'API Discord
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [tsx](https://github.com/privatenumber/tsx) - Exécution TypeScript pour le développement
- [tsup](https://tsup.egoist.dev/) - Bundler TypeScript rapide
- [dotenv](https://github.com/motdotla/dotenv) - Gestion des variables d'environnement
## 📝 Ajouter une nouvelle commande
1. Créez un nouveau fichier dans `src/commands/` (ex: `ma-commande.ts`)
2. Exportez votre commande avec la structure suivante :
```typescript
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("ma-commande")
    .setDescription("Description de ma commande");
export async function execute(interaction: CommandInteraction) {
    await interaction.reply("Réponse de la commande");
}
```
3. Ajoutez votre commande dans `src/commands/index.ts`
## 🐛 Dépannage
### Le bot ne se connecte pas
- Vérifiez que votre `DISCORD_TOKEN` est correct dans le fichier `.env`
- Assurez-vous que le bot est activé dans le Discord Developer Portal
### Les commandes slash n'apparaissent pas
- Les commandes sont déployées automatiquement quand le bot rejoint un serveur
- Cela peut prendre quelques minutes pour que Discord les synchronise
## 📄 Licence
ISC
## 👤 Auteur
Hugo Helluy
## 🔗 Liens
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
