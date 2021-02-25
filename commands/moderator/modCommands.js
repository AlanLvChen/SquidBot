
//TODO change to sending a private DM to user
module.exports = async function (msg, args, cmd, Discord) {

    if (cmd == 'purge') {
        if (!args[0]) return msg.reply("Please enter amount to clear.");
        if (isNaN(args[0])) return msg.reply("Please enter a real number.");
        if (args[0] > 100) return msg.reply("You can not delete more than 100 messages.");
        if (args[0] < 1) return msg.reply("You must delete at least one message.");

        await msg.channel.messages.fetch({ limit: args[0] }).then(messages => {
            msg.channel.bulkDelete(messages);
        })
    } 
    else if (cmd === 'roles') {
        const channel = '607063239037026344';
        const leaguePing = msg.guild.roles.cache.find(role => role.name === "Pinged for League");

        const leagueAt = '<@&806737253774524456>'
        const leagueEmoji = '<a:ratJam:812469988266213436>'
        const leagueName = 'ratJam'

        let embed = new Discord.MessageEmbed()
            .setColor('#CC7900')
            .setTitle('React to get your roles')
            .setDescription(`This will allow you to get pings\n\n ${leagueEmoji} ${leagueAt}`);
        console.log("how many times");
        let messageEmbed = await msg.channel.send(embed);
        messageEmbed.react(`${leagueEmoji}`);

        msg.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.channel.id === channel) {
                if (reaction.emoji.name === `${leagueName}`) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(leaguePing);
                }
            } else {
                return;
            }


        });

        msg.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id === channel) {
                if (reaction.emoji.name === `${leagueName}`) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(leaguePing);
                }
            } else {
                return;
            }

        });
    }
}