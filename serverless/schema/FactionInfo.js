const mongoose = require('mongoose');


const InfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    prefix: {
        type: String
    },

    description: {
        type: String,
        required: false,
    },

    
    // Discord ID of the role that the user has applied for
    roleid: {
        type: String,
        required: true,
        unique: true
    },

        
    // Automatically add this role when the user has the roleId
    siblingroleid: {
        type: String,
    },


    members_count: {
        type: Number,
        default: 0
    }

});

const Info = mongoose.model('faction_info', InfoSchema, 'faction_info');

module.exports = Info;
