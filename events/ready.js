const fs = require('fs');

module.exports = {
    type: "ready",
    once: true,
    async callback() {
        const guild = await Phenix.client.guilds.cache.get(Phenix.config.guildID)
        const devGuild = Phenix.client.guilds.cache.get("362215713160691713")

        let interactionNbr = 0
        fs.readdirSync(__basedir + '/interactions').forEach(typeDir => {
            fs.readdirSync(__basedir + '/interactions/' + typeDir).forEach(dir => {
                fs.readdirSync( __basedir + `/interactions/${typeDir}/${dir}`).filter(file => file.endsWith('.js')).forEach(file => {
                    const command = require(__basedir + `/interactions/${typeDir}/${dir}/${file}`);

                    if ('data' in command) {
                        let commandData = command.data.toJSON()
                        Phenix.commands[commandData.name] = {"dir": dir, "cmd": command}
                        interactionNbr++
                    } else {
                        console.log(`La commande de type ${typeDir} ${dir}/${file} n'a pas la propriété data.`)
                    }
                });
            });
        });

        require("../api")

        Phenix.guild = guild

        console.log("\x1b[32m[Connecté]" + " \x1b[34mDiscord \x1b[0m")
        console.log("\x1b[34m[Interaction]" + `\x1b[0m Chargement de \x1b[34m${interactionNbr}\x1b[0m interactions \x1b[0m`)

        if (Phenix.dev === false) {
            devGuild.channels.cache.get("1365777857120309318").send("Démarrage du bot en production")
        }

        await Phenix.utils.registerCommands();
    }
}