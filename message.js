const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    reciever: {
        type: String,
    },


    message: {


        type: String,
    },


    senderdp: {



        type: String,
    },


    recieverdp: {


        type: String,
    },

    seen: {
        type: Boolean,
        default: false,
    }



}, { timestamps: true });
UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 108000 });


const UserModel = mongoose.model('Messages', UserSchema);

module.exports = UserModel;