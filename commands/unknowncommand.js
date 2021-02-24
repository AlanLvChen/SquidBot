const fetch = require('node-fetch');

module.exports = async function (msg, args, Discord) {
    //Picks a random gif from Tenor
    //let url = `https://g.tenor.com/v1/search?q=smh&key=${process.env.TENORKEY}&contentfilter=off`
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFKEY}&q=smh&limit=3`
    let response = await fetch(url);
    let json = await response.json();
    const index = Math.floor(Math.random() * json.data.length);

    let slug = json.data[index].slug;

    let source = slug.split('-').slice(-1);

    let gifURL = `https://media.giphy.com/media/${source}/giphy.gif`;
    console.log(gifURL);
    
    //This creates an message embed but for some reason. ".setImage(json.results[index].url" opens the tenor website that goes to the 
    //gif but the link doesn't end in .gif, so the embed message cant display the gif
    const newEmbed = new Discord.MessageEmbed().setImage(gifURL);

    //sends embed to discord
    msg.channel.send(newEmbed);


    //The command below directly sends the .gif ending url but I want to embed the message to make it look better
    //msg.channel.send(json.results[index].url);
}
