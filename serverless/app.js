const express = require("express");
const cors = require("cors");

// import dotenv
require('dotenv').config();

// Connect to mongodb using mongoose
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// import jwt
const jwt = require("jsonwebtoken");
const PKDServer = process.env.PKD_SERVER;


// set cronjob to use asia/singapore timezone
process.env.TZ = 'Asia/Singapore';

const app = express();

const DiscordBotUtil = require("./utils/DiscordBotUtil");


app.use(cors({
    origin: [
        'https://lluprisinglll-didactic-fishstick-9q55qr4grppfrg9-3000.preview.app.github.dev',
        'https://mir4-26fc8.web.app'
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
})); // preflight OPTIONS; put before other routes


app.use(express.urlencoded({
    extended: true
}));
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
        // { expiresIn: '2h'}
    );


    userData.token = jwToken;


    res.status(200).json(userData)


});

const auth = require("./middleware/auth");

// import FactionApplications
const FactionApplications = require('./schema/FactionApplications');
const FactionInfo = require('./schema/FactionInfo');

// group by routes and add prefix /api/v1

const router = express.Router();

app.use("/api/v1", auth, router);

router.post("/apply", async (req, res) => {
    const userDetail = req.user;
    const { faction } = req.body;

    // Check if discordId with roleId already exists
    const existingApplication = await FactionApplications.findOne({
        serverId: PKDServer,
        discordId: userDetail.user.id,
        roleId: String(faction)
    });

    if (existingApplication) {
        res.json({
            isSuccess: 0,
            message: 'You have already applied for this faction. Try refreshing the page'
        });
        return;
    }

    const factionApplications = new FactionApplications({
        discordId: userDetail.user.id,
        discordUsername: userDetail.user.username,
        discordDiscriminator: userDetail.user.discriminator,
        roleId: String(faction),
        serverId: String(PKDServer)
    });

    try {
        await factionApplications.save();
        res.send({
            isSuccess: 1,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        res.send({
            isSuccess: 0,
            message: error.message
        });
    }
});

router.post("/cancel", async (req, res) => {
    const userDetail = req.user;
    const { faction } = req.body;

    // Delete application
    const deletedApplication = await FactionApplications.deleteOne({
        serverId: PKDServer,
        discordId: userDetail.user.id,
        roleId: faction
    });

    if (deletedApplication.deletedCount === 0) {
        res.json({
            isSuccess: 0,
            message: 'You have not applied for this faction. Try refreshing the page'
        });
        return;
    }

    res.send({
        isSuccess: 1,
        message: 'Application cancelled successfully'
    });
    
});

router.get("/factions", async(req, res) => {
    // fetch all faction_info and return it as json, do not include _id
    try {
        const userDetail = req.user;

        const factions = await FactionInfo.find({}, { projection: { _id: 0 } });

        const applications = await FactionApplications.find({
            discordId: userDetail.user.id,
            serverId: PKDServer
        }).select('roleId -_id');

        const roleIdArray = applications.map(application => application.roleId);

        const responseData = factions.map(faction => ({
            ...faction.toObject(),
            hasApplied: roleIdArray.includes(faction.roleid)
        }));

        res.status(200).json({
            isSuccess: 1,
            data: responseData
        });
    } catch (error) {
        res.status(200).json({
            isSuccess: 0,
            message: "Something when wrong while trying to get faction informations, Please try again later"
        })
    }

});


// TODO: Recount when a user has been accepted, leave a faction
// DiscordBotUtil.emit("recountMembers", null);

app.get("*", (req, res) => {
    res.send("Nothing is here motherfucker!");
}
);

// server listening 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);



});



