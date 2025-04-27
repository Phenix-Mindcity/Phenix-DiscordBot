const express = require('express');
const app = express()

app.get('/updateMember', async (req, res) => {
    res.send("En cours")

    Phenix.utils.updateMember(req.query.discord)
})

app.get('/updatePilote', async (req, res) => {
    res.send("En cours")

    Phenix.utils.updatePilote(req.query.discord)
})

app.listen(Phenix.config.apiPort, 'localhost', function() {
    console.log("\x1b[32m[Connecté]" + " \x1b[0mAPI \x1b[0m")
});