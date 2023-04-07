const mongoose = require('mongoose');


const ValidTokensSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
    },

    token: {
        type: String,
        required: true,
    }

    
});

const Info = mongoose.model('valid_tokens', ValidTokensSchema);

module.exports = Info;
