const { Message } = require("discord.js")

module.exports = async function (msg, args) {

    if(!args[0]) return msg.channel.reply("Please enter amount to clear.");
    if(isNaN(args[0])) return msg.channel.reply("Please enter a real number.");
    if(args[0] > 100) return msg.reply("You can not delete more than 100 messages.");
    if(args[0] < 1) return msg.reply("You must delete at least one message.");

    await msg.channel.messages.fetch({limit: args[0]}).then(messages => {
        msg.channel.bulkDelete(messages);
    })
}