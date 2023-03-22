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


    // Import discord-reminder.config.json
    const cronSchedules = require('../jobs/discord-reminder.config.json');


    // interval every 5 minutes
    setInterval(async () => {
        // check the current time in utc+8
        const now = new Date();
        const utc8 = now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const utc8Date = new Date(utc8);
        const utc8Hour = utc8Date.getHours();
        const utc8Minute = utc8Date.getMinutes();

        
        // loop through the config but limit the ram usage
        for (let i = 0; i < cronSchedules.length; i++) {
            const { timeHour, timeMinute, message } = cronSchedules[i];

            if (utc8Hour === timeHour && utc8Minute === timeMinute) {
                channel.send(message);
            }
        }
    }, 1000 * 60 * 5); // should be 5 minutes
});

// Log our bot in using the token from https://discord.com/developers/applications
DiscordClient.login(process.env.DISCORD_TOKEN);