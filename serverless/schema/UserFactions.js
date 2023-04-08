const mongoose = require('mongoose');

const UserFactionsSchema = new mongoose.Schema({
    serverId: {
      type: String,
      required: true,
    },

    discordId: {
      type: String,
      required: true,
      unique: true, // Set the discordId key to be unique
    },

    discordUsername: {
      type: String,
      required: true,
    },

    discordDiscriminator: {
      type: Number,
      required: true,
    },

    roleIds: [{
      type: String,
      required: true,
    }],

  });
  

const UserFactions = mongoose.model('user_factions', UserFactionsSchema);

module.exports = UserFactions;
