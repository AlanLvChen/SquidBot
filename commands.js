
const unknownCommand = require("./commands/unknowncommand.js");
const purge = require("./commands/moderator/purge.js");


const Discord = require('discord.js');

const commands = {
    unknownCommand,
    purge,    
}
module.exports = async function (msg) {
    console.log(msg.content);
    if (msg.channel.id == "812777913791414282") {
        let tokens = msg.content.split(" ");
        let command = tokens.shift();
        if (command.charAt(0) == "!") {
            command = command.substring(1);
            if (command in commands) {
                console.log("TRUE");
                commands[command](msg, tokens);
            } else {
                commands["unknownCommand"](msg, tokens, Discord);
            }
            
        }
        
    }
}