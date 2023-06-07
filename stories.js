const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    storyUrl: {
        type: String,
    },
    dp: {
        type: String,
    },
}, { timestamps: true });

// Add a TTL index for the "createdAt" field
UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 });

const UserModel = mongoose.model('stor', UserSchema);

module.exports = UserModel;