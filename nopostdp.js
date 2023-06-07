const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    dp: {


        type: String,
    },


}, { timestamps: true });


const UserModel = mongoose.model('nopostdp', UserSchema);

module.exports = UserModel;