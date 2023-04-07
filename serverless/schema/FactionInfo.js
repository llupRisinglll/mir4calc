const mongoose = require('mongoose');


const InfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false,
    },

    
    // Discord ID of the role that the user has applied for
    roleId: {
        type: Number,
        required: true,
    },

        
    // Automatically add this role when the user has the roleId
    siblingRoleId: {
        type: Number,
        required: true,
    },


    memberCount: {
        type: Number,
        default: 0
    }

});

const Info = mongoose.model('faction_info', InfoSchema);

module.exports = Info;
