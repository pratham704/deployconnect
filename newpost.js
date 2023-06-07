const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },


    dp: {


        type: String,
    },

    about: {

        type: String,

    },

    likes: {
        type: [String],
        default: [],
    }


    ,

    comments: {
        type: [String],
        default: [],
    }

    ,

    commentedby: {


        type: [String],
        default: [],
    }


}, { timestamps: true });


const UserModel = mongoose.model('postssss', UserSchema);

module.exports = UserModel;