require('dotenv').config();


const Discord = require('discord.js');
const commandHandler = require("./commands.js");

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
client.login(process.env.TOKEN);

client.on('ready', readyDiscord);

function readyDiscord() {
    console.log("Connected");
}

client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Member');

    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('457713121578975255').send(`Hey <@${guildMember.user.id}>, welcome to **House of Squids**! Make sure to check out the roles channel.`);
})

 

client.on('message', commandHandler);