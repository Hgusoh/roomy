# Guide de contribution
Merci de votre intérêt pour contribuer à Roomy ! 🎉
## 🚀 Démarrage rapide
1. Forkez le projet
2. Clonez votre fork : `git clone https://github.com/VOTRE_USERNAME/roomy.git`
3. Installez les dépendances : `npm install`
4. Copiez `.env.example` en `.env` et remplissez vos credentials Discord
5. Lancez en mode développement : `npm run dev`
## 📝 Conventions de code
- Utilisez TypeScript strict
- Formatez votre code avant de commit
- Testez vos changements localement
## 🔄 Workflow Git
1. Créez une branche pour votre fonctionnalité : `git checkout -b feature/ma-fonctionnalite`
2. Committez vos changements : `git commit -m "feat: ajout de ma fonctionnalité"`
3. Poussez vers votre fork : `git push origin feature/ma-fonctionnalite`
4. Ouvrez une Pull Request
## 📦 Structure d'une commande
```typescript
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("nom-commande")
    .setDescription("Description de la commande");
export async function execute(interaction: CommandInteraction) {
    // Votre logique ici
    await interaction.reply("Réponse");
}
```
## ❓ Questions
Si vous avez des questions, n'hésitez pas à ouvrir une issue !
