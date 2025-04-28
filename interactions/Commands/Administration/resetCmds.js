const { PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetcmds')
        .setDescription('Réinitialiser les commandes.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.guild.id !== Phenix.config.guildID) return;

        if (interaction.member.id === Phenix.config.devID) {
            await interaction.deferReply({ content: "En cours de chargement..", ephemeral: true })

            try {
                await Phenix.utils.registerCommands()
            } catch (err) {
                await interaction.editReply({ content: "Une erreur est survenue", ephemeral: true });
                throw err;
            }

            await interaction.editReply({ content: "Les commandes ont été réinitialisés !", ephemeral: true });
        } else {
            await interaction.reply({ content: "Tu n'as pas la permission !", ephemeral: true });
        }
    }
}