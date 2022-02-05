const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema(
    {
        content: {type: String, required: true, maxLength: 280},
        author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        retweets: [{ type: Schema.Types.ObjectId, ref: "User"}],
        replyToWhich: {type: Schema.Types.ObjectId, ref: 'Post', default: null},
        comments: [{type: Schema.Types.ObjectId, ref: 'Post', default: []}],
        createdAt: {type: Date, default: Date.now, required: true},
        deleted: {type: Boolean, default: false},
    }
);

module.exports = mongoose.model('Post', PostSchema)