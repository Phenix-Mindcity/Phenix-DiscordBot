const { PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Envoyer un message (Dev Only).')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('type')
                .setDescription("Le type d'autrice")
                .setRequired(true)
                .addChoices(
                    { name: 'Anna (Technicienne)', value: 'Anna (Technicienne)' },
                    { name: 'Alice (Dev)', value: 'Alice (Dev)' },
                    { name: 'Axel (Graphiste)', value: 'Axel (Graphiste)' },
                ))
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Le texte')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.guild.id !== Phenix.config.guildID) return;

        if (interaction.member.id === Phenix.config.devID) {
            await interaction.deferReply({ content: "En cours de chargement..", ephemeral: true })

            await interaction.channel.createWebhook({
                name: interaction.options._hoistedOptions[0].value,
                avatar: 'https://phenix.mindcity-rp.fr/storage/img/DevLogo.png',
            })
                .then(webhook => {
                    webhook.send({
                        content: interaction.options._hoistedOptions[1].value,
                    });
                })
                .catch(console.error);

            await interaction.editReply({ content: "Le message a été envoyé", ephemeral: true });
        } else {
            await interaction.reply({ content: "Tu n'as pas la permission !", ephemeral: true });
        }
    }
}