module.exports = {
    type: "interactionCreate",
    async callback(interaction) {
        if (interaction.guildId) {
            if (interaction.guildId !== Phenix.config.guildID) return;

            if (interaction.isCommand()) {
                const commandName = interaction.commandName
                const command = Phenix.commands[commandName]

                await command.cmd.execute(interaction)
            }
        }
    }
}