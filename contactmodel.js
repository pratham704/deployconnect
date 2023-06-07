const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    requestfrompeople: {
        type: [String],
    },

    acceptedbyme: {
        type: [String],
    },

    bio: {
        type: String,
        default: 'no bio added',
    },
}, { timestamps: true });


const UserModel = mongoose.model('contachInfo', UserSchema);

module.exports = UserModel;