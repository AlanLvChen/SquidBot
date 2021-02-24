require('dotenv').config();


const Discord = require('discord.js');
const commandHandler = require("./commands");

const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', readyDiscord);

function readyDiscord() {
    console.log("Connected");
}


client.on('message', commandHandler);