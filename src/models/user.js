const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        username: {type: String, required: true, maxLength: 50},
        password: {type: String, required: true, select: false},
        email: {type: String, maxLength: 320, required: true, select: false},
        follows: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
        followers: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
        link: {type: String, required: true, maxlength: 50},
        bio: {type: String, maxLength: 380},
        pfpLink: {type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'},
        headerLink : {type: String, default: null}
    }
);

module.exports = mongoose.model('User', UserSchema)