const fetch = require('node-fetch');

module.exports = async function (msg, args, Discord) {
    //Picks a random gif from Tenor
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFKEY}&q=why%20are%20you%20the%20way%20you%20are&limit=50`
    let response = await fetch(url);
    let json = await response.json();
    const index = Math.floor(Math.random() * json.data.length);

    //grabs random gif
    let slug = json.data[index].slug;

    //grab giphy source
    let source = slug.split('-').slice(-1);

    let gifURL = `https://media.giphy.com/media/${source}/giphy.gif`;
    
    //Embedded message
    const newEmbed = new Discord.MessageEmbed()
                        .setImage(gifURL)
                        .setColor('#A652BB')
                        .setTitle(`That command does not exist.`)
                        .setDescription('\u200B')
                        .addFields(
                            { name: 'General commands', value:'`!define [term]` \n `!urban [term]` \n `!flipcoin`', inline:true},
                            { name: 'Music commands', value: '`!play [song name]` \n `!pause` \n `!skip` \n `!next` \n `!queue`', inline: true},
                            { name: '\u200B', value: '\u200B' },
                            { name: 'League commands', value: '`!match [name]` \n `!pickFive [name] [name]...` \n `!inting [name]`' , inline: true },
                            { name: 'D&D commands', value: '`!roll [ _d_ ]` \n `!handbook` \n `!elderscroll`', inline: true},
                        )
                        .setFooter('Type !music for recommended songs');

    //sends embed to discord
    msg.channel.send(newEmbed);
}
