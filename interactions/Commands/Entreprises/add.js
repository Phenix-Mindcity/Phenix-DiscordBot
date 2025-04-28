const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ajouter')
        .setDescription('Ajouter un membre de votre entreprise')
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
                interaction.options._hoistedOptions[0].member.roles.add(role)

                console.log("Ajout d'un rôle d'entreprise : " + Phenix.config.roles.direction[roleID].name)
            }
        }

        if (roleAdded) await interaction.editReply({ content: "Les rôles ont été ajoutés !", ephemeral: true });
        else await interaction.editReply({ content: "Tu ne diriges aucune entreprise !", ephemeral: true });

    }
}