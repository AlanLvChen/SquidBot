
const unknownCommand = require("./commands/unknowncommand.js");
const musicCommands = require("./commands/musicCommands.js");
const generalCommands = require("./commands/generalCommands.js");
const moderatorCommands = require("./commands/moderator/modCommands.js");


const Discord = require('discord.js');

//general commands
const commands = {
    unknownCommand,
    play: musicCommands,
    stop: musicCommands,
    skip: musicCommands,
    pause: musicCommands,
    queue: musicCommands,
    urban: generalCommands,
    flipcoin: generalCommands,
    
}

//commands for mods
const modCommands = {
    purge: moderatorCommands,
    roles: moderatorCommands,
}

//Used for testing command
uglyRegex = /[\[\]\.,-\/#!$%\^&\*;:{}=\-_`~()]/
admin = '806731817474326578'
mod = '806731247820079114'

module.exports = async function (msg) {
    //Currently only works in bot-testing channel
    //if (msg.channel.id == "812777913791414282") {
        let tokens = msg.content.split(" ");
        let command = tokens.shift();

        //if message starts with ! and after that isnt !!
        if (command.charAt(0) == "!" && !(command.length == 1 || command.charAt(1).match(uglyRegex))) {
            command = command.substring(1);

            //if general command
            if (command in commands) {
                console.log("General command was called");
                commands[command](msg, tokens, command, Discord);
            
            //if mod command 
            } else if (command in modCommands && (msg.member.roles.cache.has(admin) || msg.member.roles.cache.has(mod))) {
                console.log("Mod command was called");
                modCommands[command](msg, tokens, command, Discord);
            
            //else not a command
            } else {
                commands["unknownCommand"](msg, Discord);
                console.log(command);
            }
            
        }
        
    //}
}

