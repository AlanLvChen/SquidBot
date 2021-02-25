const urban = require('urban');

module.exports = async function (msg, args, cmd, Discord) {


    //urban dictionary command
    if (cmd === 'urban') {
        if (!args.length) return msg.channel.send('You need to input term');

        let search = args[0] ? urban(args.slice(0).join(" ")) : urban.random();
        let image = 'https://i.imgur.com/VFXr0ID.jpg';
        try {
            search.first(res => {
                if (!res) return msg.channel.send("No results found for this topic");
                let { word, definition, example, thumbs_up, thumbs_down, permalink, author } = res;
                let embed = new Discord.MessageEmbed()
                    .setColor("#A62019")
                    .setTitle(`Urban Dictionary | ${word}`, image)
                    .setURL(`${permalink || "https://www.urbandictionary.com/"}`)
                    .setThumbnail(image)
                    .setDescription(`${definition || "No definition"}`)
                    .addFields(
                        { name: '**Example**', value: `${example || "No Example"}` },
                        { name: '👍', value: `${thumbs_up || 0}`, inline: true },
                        { name: '👎', value: `${thumbs_down || 0}`, inline: true }
                    )
                    .setFooter(`Sent by ${author || "unknown"}`)
                msg.channel.send(embed);
            })
        } catch (e) {
            console.log(e);
            return msg.channel.send("Error retrieving Urban Dictionary term")
        }
    }

    //flips a coin
    if (cmd === 'flipcoin') {
        return msg.channel.send(`***${(Math.random() > 0.5)? 'Heads' : 'Tails'}***`);

    }
}