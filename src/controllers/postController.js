const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const passport = require('passport');
const post = require('../models/post');
const { findByIdAndUpdate } = require('../models/post');


//get my feed
exports.post_followed_list = [passport.authenticate(['jwt'] ),
     async (req, res, next) => {
        const limit = 15;
        const page = parseInt(req.params.page)
        if (isNaN(page)) return res.status(400).send('Not a valid page number')
        try {
            const posts = await Post.find({replyToWhich: null, deleted: false, author: { $in: req.user.follows}})
            .sort({ createdAt: - 1})
            .limit(limit)
            .skip(page * limit)
            .populate('author')
            return res.status(200).json(posts);
        } catch(err){
            return res.status(400).send(err);
        }
    }
];

//get user posts
exports.post_get_user = async (req,res,next) => {
    try {
        const user = await User.findOne({link: req.params.link})
        const posts = await Post.find({author: user, replyToWhich: null, deleted: false}).populate('author').sort({ createdAt: - 1})
        return res.status(200).json(posts)
    } catch (err) { 
        return res.status(400).send(err)
    }
}

//get user replies

exports.post_get_user_replies = async (req,res,next) => {
    try {
        const user = await User.findOne({link: req.params.link})
        const posts = await Post.find({author: user, replyToWhich: {$ne : null} }).populate('author').sort({ createdAt: - 1})
        return res.status(200).json(posts)
    } catch (err) { 
        return res.status(400).send(err)
    }
}

//get a post
exports.post_get = async (req,res,next) => 
{
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).send('Post not found');
    }
    Post.findById(req.params.id)
    .populate('author')
    .populate({
        path: 'comments',
        populate:'author'
    })
    .exec(async (err, post) => {
        if (err) { return next(err); }
        if (post==null) { 
            return res.status(404).send('Post not found');
        }
        return res.status(200).json(post)
    })
};

//get Parent replies
exports.post_get_parent_replies = async (req,res,next) => 
{
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).send('Post not found');
    }
    const posts = []
    try{
        let cur = await Post.findById(req.params.id) //4
        while(cur.replyToWhich){
            cur = await Post.findById(cur.replyToWhich).populate('author')//3
            posts.unshift(cur)
        }
    return res.status(200).json(posts)
    } catch(err){
        return res.status(400).send(err)
    }
};

//create a new post
exports.post_create = [passport.authenticate(['jwt']),

    // Validate and sanitise fields.
    body('content').trim().isLength({ min: 1 }).withMessage('must not be empty')
    .isLength({ max: 280}).withMessage('must be less than 280 chracters') ,
    // Process request after validation and sanitization.
    async (req,res,next) =>{
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const post = new Post({
            content: req.body.content,
            author: req.user,
            replyToWhich: req.body.replyToWhich
        });
        await post.save(async function(err, item){
            if (err) return res.status(400). send(err)
            try{
                if (req.body.replyToWhich){
                    await Post.findByIdAndUpdate(req.body.replyToWhich, {$push: {comments: post}})
                }
            } catch(err) {
                return res.status(400).send(err)
            }
            return res.status(201).json(item);
        });
    }
];

//delete a post
exports.post_delete = [passport.authenticate(['jwt']),
    async (req, res, next) => {
        const post = await Post.findById(req.params.id).populate('replyToWhich')
        if (!post) {
            return res.status(404).send('Post not found')
        }
        if (!post.author.equals(req.user._id)){
        return res.status(400).json('User is not the author of the post');
        }
        if (post.comments.length == 0) {
            await Post.findByIdAndDelete(req.params.id)
            if (post.replyToWhich){
                await Post.findByIdAndUpdate(post.replyToWhich._id, {$pullAll: {comments: [post]}})
                if (post.replyToWhich.deleted){
                    req.params.id = post.replyToWhich._id
                    this.post_delete[1](req, res, next);
                }
            }
            return res.status(200).json(null)
        } else {
            Post.findById(req.params.id).exec(async (err, post) => {
                if (err) { return next(err); }
                if (post==null) { 
                    //return res.status(404).json({error: 'User not found'});
                }
                // Successful
                const newPost = await Post.findByIdAndUpdate(req.params.id, {content: 'deleted', deleted: true}, {new: true}).populate('author')
                return res.status(200).json(newPost)
            })
        }
    }
]


//toggle like post
exports.post_like_toggle = [passport.authenticate(['jwt']),
    async (req,res,next) => {
        if (!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).send('Post not found');
        }
    Post.findById(req.params.id).exec(async (err, post) => {
        if (err) return next(err);
        if (post == null) {
            return res.status(404).send('Post not found');
        }
        if (post.likes.includes(new mongoose.Types.ObjectId(req.user))){
            //unlike post
            const post = await Post.findByIdAndUpdate(req.params.id, {$pullAll: {likes: [req.user]}}, {new: true});
            return res.status(200).json(post.likes)
        } else {
            //like post
            const post = await Post.findByIdAndUpdate(req.params.id, {$push: {likes: req.user}}, {new: true});
            try {
              return res.status(200).json(post.likes)
            } catch(err){
                return res.status(400).send(err);
            }
        }
    })
}];