module.exports = {
    async updateMember (DiscordID) {
        const member = await Phenix.guild.members.cache.get(DiscordID)
        const User = (await Phenix.db.getUser(DiscordID))[0];

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
}