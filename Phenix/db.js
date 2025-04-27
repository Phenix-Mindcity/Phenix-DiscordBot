module.exports = {
    async query(query) {
        let result = undefined

        await Phenix.sql.query(query, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            result = results
        });

        let i = 0
        while (result === undefined) {
            await new Promise(resolve => setTimeout(resolve, 10));
            i++
            if (i === 150) break
        }

        return result
    },
    async getUser(discord){
        try {
            return await this.query(`SELECT * FROM \`users\` WHERE id=${discord};`);
        } catch (err) {
            throw err;
        }
    },
    async getPilote(discord){
        try {
            return await this.query(`SELECT * FROM \`pilotes\` WHERE discord=${discord};`);
        } catch (err) {
            throw err;
        }
    },
}