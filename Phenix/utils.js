const fs = require('fs');
const { REST, Routes } = require('discord.js');

module.exports = {
    async updateMember (DiscordID) {
        const member = await Phenix.guild.members.cache.get(DiscordID)
        const User = (await Phenix.db.getUser(DiscordID))[0];
        if (User === undefined) return;

        const memberRole = Phenix.guild.roles.cache.get(Phenix.config.roles.member);

        if (User.rank >= 5) {
            const adminRole = Phenix.guild.roles.cache.get(Phenix.config.roles.admin);

            console.log(DiscordID + " - Ajout du rôle de membre")
            try {
                member.roles.add(memberRole)
            } catch (err) {
                console.log(err)
            }

            if (User.rank >= 10) {
                console.log(DiscordID + " - Ajout du rôle d'admin")
                member.roles.add(adminRole)
            } else {
                if (member.roles.cache.has(Phenix.config.roles.admin)) {
                    console.log(DiscordID + " - Supression du rôle d'admin")
                    member.roles.remove(adminRole)
                }
            }
        } else {
            if (member.roles.cache.has(Phenix.config.roles.member)) {
                console.log(DiscordID + " - Supression du rôle de membre")
                member.roles.remove(memberRole)
            }
        }
    },
    async updatePilote(DiscordID) {
        const member = await Phenix.guild.members.cache.get(DiscordID)
        const Pilotes = await Phenix.db.getPilote(DiscordID);
        const roles = {
            "Rallye" : false,
            "Ring Of Hell" : false,
            "Street Race" : false,
            "F1" : false,
            "Truck" : false,
        }

        Pilotes.forEach(pilote => {
            roles[pilote.course] = true
        })

        for (const [course, isPilote] of Object.entries(roles)) {
            try {
                const role = Phenix.guild.roles.cache.get(Phenix.config.roles.pilotes[course]);

                if (member.roles.cache.has(Phenix.config.roles.pilotes[course]) && !isPilote) {
                    console.log(DiscordID + " - Supression du rôle " + course)
                    member.roles.remove(role)
                } else if (!member.roles.cache.has(Phenix.config.roles.pilotes[course]) && isPilote) {
                    console.log(DiscordID + " - Ajout du rôle " + course)
                    member.roles.add(role)
                }
            } catch (err) {
                console.log(err)
            }
        }
    },
    async registerCommands() {
        const commandsList = []
        Phenix.commands = []

        fs.readdirSync(__basedir + '/interactions').forEach(typeDir => {
            fs.readdirSync(__basedir + '/interactions/' + typeDir).forEach(dir => {
                fs.readdirSync( __basedir + `/interactions/${typeDir}/${dir}`).filter(file => file.endsWith('.js')).forEach(file => {
                    const command = require(__basedir + `/interactions/${typeDir}/${dir}/${file}`);

                    if ('data' in command) {
                        let commandData = command.data.toJSON()
                        console.log(`Ajout de l'interaction de type ${typeDir}, du nom de ${commandData.name} présente dans le dossier ${dir}`)

                        Phenix.commands[commandData.name] = {"dir": dir, "cmd": command}

                        if ('execute' in command) {
                            commandsList.push(commandData);
                        }
                    } else {
                        console.log(`La commande de type ${typeDir} ${dir}/${file} n'a pas la propriété data.`)
                    }
                });
            });
        });

        const rest = new REST().setToken(Phenix.pass.DiscordToken);

        await (async () => {
            try {
                console.log(`Lancement de la réinitialisation de ${commandsList.length} commandes.`)

                const data = await rest.put(
                    Routes.applicationGuildCommands(Phenix.config.clientID, Phenix.config.guildID),
                    {body: commandsList},
                );

                console.log(`Réinitialisation de ${data.length} commandes effectués avec succès`)
            } catch (err) {
                console.log(err)
            }
        })();
    },
}