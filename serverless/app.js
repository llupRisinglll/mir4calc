const express = require("express");
const cors = require("cors");

// import jwt
const jwt = require("jsonwebtoken");

const PKDServer = '912962966062764062';

// load the .env file
require('dotenv').config();

// set cronjob to use asia/singapore timezone
process.env.TZ = 'Asia/Singapore';


// myIntent.add(IntentsBitField.Flags.GuildPresences);
// myIntent.add(IntentsBitField.Flags.GuildMessages);
// myIntent.add(IntentsBitField.Flags.GuildMessageReactions);
// myIntent.add(IntentsBitField.Flags.GuildMessageTyping);
// myIntent.add(IntentsBitField.Flags.GuildVoiceStates);
// myIntent.add(IntentsBitField.Flags.GuildInvites);
// myIntent.add(IntentsBitField.Flags.GuildWebhooks);
// myIntent.add(IntentsBitField.Flags.GuildIntegrations);
// myIntent.add(IntentsBitField.Flags.GuildEmojisAndStickers);
// myIntent.add(IntentsBitField.Flags.GuildMembers);
// myIntent.add(IntentsBitField.Flags.Guilds);


// self involked function
(async () => {
    const tokenType = "Bearer";
    const accessToken = "1mkE6P9yhhk0ncFYt46sxXhGNw3eJ3";


})();




// DiscordClient.on('ready', async () => {

//     console.log(`Logged in as ${DiscordClient.user.tag}`);

//     // Get an array of all the guilds the user is a member of
//     const guilds = DiscordClient.guilds.cache.array();

//     console.log(guilds);
// });




// verify the token via the discord api
//  fetch('https://discord.com/api/users/@me/guilds', {
//     headers: {
//         authorization: `${tokenType} ${accessToken}`,
//     },
// })
// .then(result => result.json())
// .then(response => {
//     console.log(response);
//     //handle response
// })
// .catch(console.error);

// Log our bot in using the token from https://discord.com/developers/applications

const app = express();


app.use(cors({
    origin: [
        'https://lluprisinglll-didactic-fishstick-9q55qr4grppfrg9-3000.preview.app.github.dev',
        'https://mir4-26fc8.web.app'
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
})); // preflight OPTIONS; put before other routes


app.use(express.urlencoded());
app.use(express.json());

// port
const port = process.env.PORT || 8080;

// routes
app.post("/api/v1/auth", async (req, res) => {
    const { token: accessToken, type: tokenType } = req.body;

    const result = await fetch(`https://discord.com/api/users/@me/guilds/${PKDServer}/member`, {
        // const result = await fetch(`https://discord.com/api/guilds/${PKDServer}/member`, {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    });


    const response = await result.json();


    const expectedStructure = {
        "nick": "string",
        "user": {
            "id": "string",
            "username": "string",
            "avatar": "string",
            "discriminator": "string",
        },

        "joined_at": "string",

        "roles": [
            "string"
        ],
    };


    // check if the response is in the expected structure, according expectedStructure variable key value pairs
    const isResponseValid = Object.keys(expectedStructure).every(key => {
        return Object.keys(response).includes(key);
    });

    // Validate the response
    if (!isResponseValid) {
        res.status(400).send("Response is not in the expected structure")
        return;
    }

    // VALIDATION: restructure the response to match the expected structure
    const userData = Object.keys(expectedStructure).reduce((acc, key) => {
        if (typeof expectedStructure[key] === "object") {
            // if the value is an object but an array, then it is an array of objects
            if (Array.isArray(expectedStructure[key])) {

                // match the datatype according the expectedStructure variable
                const dataType = expectedStructure[key][0];

                // use this datatype for each value of the array
                acc[key] = response[key].map(value => {
                    return dataType === "string" ? value : parseInt(value);
                });

            } else {
                acc[key] = Object.keys(expectedStructure[key]).reduce((acc2, key2) => {
                    acc2[key2] = response[key][key2];
                    return acc2;
                }, {});
            }

        } else {
            acc[key] = response[key];
        }
        return acc;
    }, {});


    // generate a jwt response with nick and user data
    const jwToken = jwt.sign(
        { nick: userData.nick, user: userData.user },
        process.env.JWT_SECRET,
        { expiresIn: '2h'}
    );


    userData.token = jwToken;


    res.status(200).json(userData)


});


app.get("*", (req, res) => {
    res.send("Nothing is here motherfucker!");
}
);

// server listening 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



