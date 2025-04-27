const fs = require('fs');
const mysql = require('mysql');

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const myArgs = process.argv.slice(2);

global.__basedir = __dirname;
global.Phenix = require('./Phenix');

if (myArgs.length > 0 && myArgs[0] === "dev") {
    global.Phenix = require('./Phenix/dev');
    Phenix.dev = true
    console.log("Launching in " + "\x1b[32mdeveloper\x1b[0m" + " mode\n")
} else {
    Phenix.dev = false
    console.log("Launching in " + "\x1b[34mproduction\x1b[0m" + " mode\n")
}

process.on('uncaughtException', function (err) {
    console.error(err);
});

let db = mysql.createConnection({
    host: Phenix.pass.DB_Host,
    user: Phenix.pass.DB_User,
    port: Phenix.pass.DB_Port,
    password: Phenix.pass.DB_Password,
    database: Phenix.pass.DB_Name,
    supportBigNumbers: true,
    bigNumberStrings: true
});

db.connect(function(err) {
    if (err) throw err;
    console.log("\x1b[32m[Connecté]" + " \x1b[37mDB");
});

Phenix.sql = db;
Phenix.client = client;

// Enregistrement des events
fs.readdirSync('events').forEach(file => {
    const event = require(`./events/${file}`);
    if(event.once) client.once(event.type, event.callback.bind(event));
    else client.on(event.type, event.callback.bind(event));
});

client.login(Phenix.pass.DiscordToken)