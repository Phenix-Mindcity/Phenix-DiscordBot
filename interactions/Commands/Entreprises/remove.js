const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('retirer')
        .setDescription('Retirer un membre de votre entreprise')
        .addMentionableOption(option =>
            option.setName('qui')
                .setDescription('Personne à ajouter')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.guild.id !== Phenix.config.guildID) return;
        await interaction.deferReply({ content: "En cours de chargement..", ephemeral: true })
        let roleAdded = false

        for (const [roleID, _] of interaction.member.roles.cache) {
            if (Phenix.config.roles.direction[roleID] !== undefined) {
                roleAdded = true
                const role = Phenix.guild.roles.cache.get(Phenix.config.roles.direction[roleID].id);
                interaction.options._hoistedOptions[0].member.roles.remove(role)

                console.log("Retrait d'un rôle d'entreprise : " + Phenix.config.roles.direction[roleID].name)
            }
        }

        if (roleAdded) await interaction.editReply({ content: "Les rôles ont été retirés !", ephemeral: true });
        else await interaction.editReply({ content: "Tu ne diriges aucune entreprise !", ephemeral: true });

    }
}