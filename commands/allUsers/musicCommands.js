const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = async function (msg, args, cmd) {
    //Get user voice channel
    const voice_channel = msg.member.voice.channel;

    //If user isnt in voice channel return
    if (!voice_channel) return msg.channel.send('You need to be in a channel to execute this command!');

    const server_queue = queue.get(msg.guild.id);

    //If command is play
    if (cmd === 'play') {

        if (!args.length) return msg.channel.send('You need to send the song name');

        args.push("(audio)");
        let song = {};

        if (ytdl.validateURL(args[0])) {

            const song_info = await ytdl.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
        } else {
            //If the video is not a url then use keyword to find video
            const video_finder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }

            const video = await video_finder(args.join(' '));
            if (video) {
                song = { title: video.title, url: video.url };
            } else {
                msg.channel.send('Error finding video.');
            }
        }

        if (!server_queue) {

            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: msg.channel,
                connection: null,
                songs: []
            }

            queue.set(msg.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                const connection = await voice_channel.join();
                queue_constructor.connection = connection;
                video_player(msg.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(msg.guild.id);
                msg.channel.send('There was an error connecting!');
                throw err;
            }
        } else {
            server_queue.songs.push(song);
            return msg.channel.send(`👍 **${song.title}** added to queue!`);
        }
    }
    else if (cmd === 'skip') skip_song(msg, server_queue);
    else if (cmd === 'stop') stop_song(msg, server_queue);
    else if (cmd === 'pause') pause_song(msg, server_queue);
    else if (cmd === 'queue') display_queue(msg);

}

const video_player = async (guild, song) => {

    const song_queue = queue.get(guild.id);
    if (!song) {
        console.log("IT QUIT");
        setTimeout(() => {
            song_queue.voice_channel.leave();
        }, 150000);
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.08 })
        .on('finish', () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
        });
    const newEmbed = {
        color: 0x0099ff,
        title: `🎶 Now playing ***${song.title}*** 🎶`,
    }
    await song_queue.text_channel.send({ embed: newEmbed });

}

const skip_song = (msg, server_queue) => {
    if (!msg.member.voice.channel) return msg.channel.send('You need to be in a channel to execute this command!');
    if (!server_queue) {
        return msg.channel.send(`There are no songs in queue... 😓`);
    }
    server_queue.connection.dispatcher.end();
    const newEmbed = {
        color: 0x0099ff,
        title: '🎶 Successfully skipped 🎶',
        description: `***${queue.get(msg.guild.id).songs[0].title}***`,
    }
    msg.channel.send({ embed: newEmbed });
}

const stop_song = (msg, server_queue) => {
    if (!msg.member.voice.channel) return msg.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}

const pause_song = (msg, server_queue) => {
    if (!msg.member.voice.channel) return msg.channel.send('You need to be in a channel to execute this command!');
    if (server_queue.connection.dispatcher.paused) {
        server_queue.connection.dispatcher.resume();
        const newEmbed = {
            color: 0x0099ff,
            title: `▶ Successfully Resumed: ***${queue.get(msg.guild.id).songs[0].title}***`,
        }
        msg.channel.send({ embed: newEmbed });
    } else {
        server_queue.connection.dispatcher.pause();
        const newEmbed = {
            color: 0x0099ff,
            title: `⏸ Successfully Paused: ***${queue.get(msg.guild.id).songs[0].title}***`,
        }
        msg.channel.send({ embed: newEmbed });
    }
}

const display_queue = (msg) => {
    const lst = [];
    queue.get(msg.guild.id).songs.forEach(song => lst.push({ 'name': `***${song.title}***`, 'value': '\u200B' }));

    const newEmbed = {
        color: 0x0099ff,
        title: `Music Queue`,
        description: 'Currently Playing:',
        fields: [lst]
    }

    //sends embed to discord
    msg.channel.send({ embed: newEmbed });

}

