const { Client, IntentsBitField } = require('discord.js');

// load the .env file
require('dotenv').config();

// set cronjob to use asia/singapore timezone
process.env.TZ = 'Asia/Singapore';

const myIntent = new IntentsBitField();

myIntent.add(IntentsBitField.Flags.GuildPresences);
myIntent.add(IntentsBitField.Flags.GuildMessages);
myIntent.add(IntentsBitField.Flags.GuildMessageReactions);
myIntent.add(IntentsBitField.Flags.GuildMessageTyping);
myIntent.add(IntentsBitField.Flags.GuildVoiceStates);
myIntent.add(IntentsBitField.Flags.GuildInvites);
myIntent.add(IntentsBitField.Flags.GuildWebhooks);
myIntent.add(IntentsBitField.Flags.GuildIntegrations);
myIntent.add(IntentsBitField.Flags.GuildEmojisAndStickers);
myIntent.add(IntentsBitField.Flags.GuildMembers);
myIntent.add(IntentsBitField.Flags.Guilds);


const DiscordClient = new Client({
    intents: myIntent
});


DiscordClient.on('ready', async () => {
    const channelId = '957557291207499837'; // Replace with known channel ID
    const channel = DiscordClient.channels.cache.get(channelId);


    if (!channel) {
        console.error('The channel does not exist!');
        return;
    }


    // interval every 5 minutes
    setInterval(async () => {
        // check the current time in utc+8
        const now = new Date();
        const utc8 = now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const utc8Date = new Date(utc8);
        const utc8Hour = utc8Date.getHours();
        const utc8Minute = utc8Date.getMinutes();
        const utc8Second = utc8Date.getSeconds();


        // check if the time is 9 21 pm of utc+8
        if (utc8Hour === 21 && utc8Minute === 42) {
            channel.send(":fire: Attention @everyone, the war in the valley is about to begin in less than 30 minutes. Kindly ensure that **the UA arrangements are in place**. :muscle:\n\n :bomb: While the battle rages on, please** take a screenshot to show your members** are present inside the valley. :camera_with_flash:\n\n:microphone2: Please **enter the appropriate voice channel** for real-time communication.\n\n:four_leaf_clover: Good luck to everyone! :fingers_crossed:");
        }

        // check if the time is 10pm of utc+8
        if (utc8Hour === 22 && utc8Minute === 0) {
            channel.send(":fire: Attention @everyone, the war in the valley is now __ONGOING~__\n\n :bomb: While the battle rages on, please don't forget to** take a screenshot to show your members** are present inside the valley. :camera_with_flash: \n\n :microphone2: Please **enter the appropriate voice channel** for real-time communication.\n\n :four_leaf_clover: Good luck to everyone! :fingers_crossed:");
        }

    }, 1000 * 60 * 1);
});

// Log our bot in using the token from https://discord.com/developers/applications
DiscordClient.login(process.env.DISCORD_TOKEN);