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

// require public/json/factions.json
const FactionInfo = require('../../serverless/schema/FactionInfo');
const UserFactions = require('../../serverless/schema/UserFactions');

const DiscordClient = new Client({
    intents: myIntent
});


// For global events
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

DiscordClient.on('ready', async () => {
    
    //  Check how many users each roleid has
    eventEmitter.on('recountMembers', async (data) => {
        const guild  = DiscordClient.guilds.cache.get(process.env.PKD_SERVER);
        const members = await guild.members.fetch();

            
        const groupedRoles = await members.reduce((acc, member) => {
            member.roles.cache.forEach(role => {
                if (acc[role.id]) {
                    acc[role.id] += 1;
                } else {
                    acc[role.id] = 1;
                }
                
            });
            return acc;
        }, {});

        const factions = await FactionInfo.find({}).lean();

        // create an array of update operations to execute in parallel
        const updates = factions.map((faction) => {
            const count = groupedRoles[faction.roleid] || 0;

            return {
                updateOne: {
                filter: { _id: faction._id },
                update: {
                    $set: {
                        members_count: count
                    },
                },
                },
            };
        });

        // execute all updates in parallel using Promise.all()
        await Promise.all(updates.map((update) => FactionInfo.bulkWrite([update])));
        console.log("Updated all factions members count");

        // TODO: Optimize the performance, run this in the background and minimize the rate of calls to the database

        // ACTION: Checks which roleid of the user is in the database
        const groupedMembers = await members.reduce((acc, member) => {
            
            member.roles.cache.forEach(role => {

                // Create a new object when it does not yet exists
                if (!acc.hasOwnProperty(member.user.id)) {
                    acc[member.user.id] = {};
                }

                // add serverid to the object
                if (!acc[member.user.id].hasOwnProperty("serverId")) {
                    acc[member.user.id]["serverId"] = process.env.PKD_SERVER;
                }

                // add the userid to the object
                if (!acc[member.user.id].hasOwnProperty("discordId")) {
                    acc[member.user.id]["discordId"] = member.user.id;
                }


                // add the username to the object
                if (!acc[member.user.id].hasOwnProperty("discordUsername")) {
                    acc[member.user.id]["discordUsername"] = member.user.username;
                }

                // add the discriminator to the object
                if (!acc[member.user.id].hasOwnProperty("discordDiscriminator")) {
                    acc[member.user.id]["discordDiscriminator"] = member.user.discriminator;
                }

                // add the roleids to the object
                if (acc[member.user.id].hasOwnProperty("roleIds")) {
                    acc[member.user.id].roleIds.push(role.id);
                } else {
                    acc[member.user.id]["roleIds"] = [role.id];
                }
                
            });

            // reformat the object to be used in bulkWrite
            acc[member.user.id] = {
                updateOne: {
                  filter: { discordId: member.user.id },
                  update: { $set: acc[member.user.id] },
                  upsert: true,
                },
            }

            return acc;
        }, {});

        // Insert to UserFactions
        try {
            const result = await UserFactions.bulkWrite(Object.values(groupedMembers), { ordered: false });
            console.log(`Updated ${result.modifiedCount} documents`);
        } catch (error) {
            console.error(error);
        }
    });
});

// Log our bot in using the token from https://discord.com/developers/applications
DiscordClient.login(process.env.DISCORD_TOKEN);

module.exports = eventEmitter;