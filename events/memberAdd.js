module.exports = {
    type: "guildMemberAdd",
    once: false,
    async callback(member) {
        if (member.guild.id !== Phenix.config.guildID) return;

        const role = await Phenix.guild.roles.cache.get(Phenix.config.roles.visiteur);
        try {
            await member.roles.add(role)
        } catch (e) {
            console.log(e)
        }

        const User = (await Phenix.db.getUser(member.user.id));
        if (!User) return;

        if (User[0] && User[0].rank && User[0].fullname !== "") member.setNickname(User.fullname)

        await Phenix.utils.updateMember(member.user.id)
        await Phenix.utils.updatePilote(member.user.id)
    }
}