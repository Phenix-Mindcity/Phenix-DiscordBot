module.exports = {
    type: "ready",
    once: true,
    async callback() {
        const guild = await Phenix.client.guilds.cache.get(Phenix.config.guildID)
        const devGuild = Phenix.client.guilds.cache.get("362215713160691713")

        require("../api")

        Phenix.guild = guild

        console.log("\x1b[32m[Connecté]" + " \x1b[34mDiscord \x1b[0m")

        if (Phenix.dev === false) {
            devGuild.channels.cache.get("1365777857120309318").send("Démarrage du bot en production")
        }
    }
}