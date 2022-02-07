const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const mongoose = require('mongoose');
//const authenticateAndGetToken = require('../helpers/authenticateAndGetToken');
const passport = require('passport');
const { uploadImage } = require('../helpers/imgur');

//get a user
exports.user_get = async (req,res,next) => {
  User.findOne({link: req.params.link}).exec((err, user) => {
    if (err) { return next(err)}
    if (user==null) {
      return res.status(404).json({error: 'User not found'});
    }
    // Successful
    return res.status(200).json(user);
  })
}

//toggle follow a user
exports.user_follow_toggle = [passport.authenticate(['jwt']),
  async (req,res,next) => {
    User.findOne({link: req.params.link}).exec(async (err,user) => {
      if (err) return next(err);
      if (user==null) {
        return res.status(404).send('User not found');
      }
      if (user.followers.includes(req.user.id)){
        //unfollow user
        await User.findByIdAndUpdate(user.id, {$pullAll: {followers: [req.user]}});
        await User.findByIdAndUpdate(req.user.id, {$pullAll: {follows: [user]}});
        return res.status(200).send('User unfollowed succesfully');
      } else {
        //follow user
        try {
          await User.findByIdAndUpdate(user.id, {$push: {followers: req.user}});
          await User.findByIdAndUpdate(req.user.id, {$push: {follows: user}});
          return res.status(200).send('User followed succesfully');
        } catch(err){
            res.status(400).send(err);
        }
      }
    })
}];

//edit profile
exports.user_update = [passport.authenticate(['jwt']),
  body('username').trim() ,
  body('bio').trim() ,
  async (req,res,next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = {
      bio: req.body.bio,
      username: req.body.username
    }

    if (req.body.pfpImage){
      pfp = await uploadImage(req.body.pfpImage, req.user.pfpLink)
      user.pfpLink = pfp.link
      user.pfpDeleteHash = pfp.deletehash
    }
    if (req.body.headerImage){
      header = await uploadImage(req.body.headerImage, req.user.headerLink)
      user.headerLink = header.link
      user.headerDeleteHash = header.deletehash
    }
    console.log(user)
    User.findByIdAndUpdate(req.user._id, user, {new: true}).then(newUser => {
      return res.status(200).json(newUser)
    }).catch(error => {
      return res.status(400).send(error)
    })
}];

//search user
exports.user_search = [
  async (req,res,next) => {
    if (req.params.search == ''){
      return res.status(400).send('Must not be empty')
    }
    try {
      const results = await User.find({link: {$regex: new RegExp('.*'+ req.params.search + '.*', 'i')}})
      return res.status(200).json(results)
    } catch(err) {
      return res.status(400).send(err)
    }
}]

//Get followers list
exports.user_get_followers = async (req,res,next) => {
  User.findOne({link: req.params.link}).populate('followers').exec((err, user) => {
    if (err) { return next(err)}
    if (user==null) {
      return res.status(404).json({error: 'User not found'});
    }
    // Successful
    return res.status(200).json(user.followers);
  })
}

//Get follows list
exports.user_get_follows = async (req,res,next) => {
  User.findOne({link: req.params.link}).populate('follows').exec((err, user) => {
    if (err) { return next(err)}
    if (user==null) {
      return res.status(404).json({error: 'User not found'});
    }
    // Successful
    return res.status(200).json(user.follows);
  })
}