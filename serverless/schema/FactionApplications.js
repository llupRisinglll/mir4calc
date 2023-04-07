const mongoose = require('mongoose');


const ApplicationSchema = new mongoose.Schema({
    // Discord ID of the user who submitted the application
    discordId: {
        type: String,
        required: true,
    },
    // Discord username of the user who submitted the application
    discordUsername: {
        type: String,
        required: true,
    },
    // Discord discriminator of the user who submitted the application
    discordDiscriminator: {
        type: Number,
        required: true,
    },
    
    // Discord ID of the role that the user has applied for
    roleId: {
        type: Number,
        required: true,
    },

    // Metadata
    // Timestamp of when the application was submitted
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    // Timestamp of when the application was last updated
    updatedAt: {
        type: Date
    },
    // Timestamp of when the application was last reviewed
    reviewedAt: {
        type: Date
    },
    // Timestamp of when the application was last approved
    approvedAt: {
        type: Date
    },
    // Timestamp of when the application was last rejected
    rejectedAt: {
        type: Date
    }
    
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
