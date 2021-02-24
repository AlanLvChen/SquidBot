const fetch = require('node-fetch');

module.exports = async function (msg, args, Discord) {
    //Picks a random gif from Tenor
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFKEY}&q=reaction&limit=10`
    let response = await fetch(url);
    let json = await response.json();
    const index = Math.floor(Math.random() * json.data.length);

    let slug = json.data[index].slug;

    let source = slug.split('-').slice(-1);

    let gifURL = `https://media.giphy.com/media/${source}/giphy.gif`;
    
    const newEmbed = new Discord.MessageEmbed()
                        .setImage(gifURL)
                        .setColor('#A652BB')
                        .setTitle(`That command does not exist.`)
                        .addFields(
                            { name: 'List of bot commands', value:'\u200b'},
                            { name: 'General commands', value:'`!define [term]` \n `!urban [term]` \n `!flipcoin`'},
                            { name: 'D&D commands', value: '`!roll [ _d_ ]`'},
                        );

    //sends embed to discord
    msg.channel.send(newEmbed);
}
