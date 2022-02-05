const User = require('../models/user')
const { body,validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const {issueJWT} = require('../helpers/jwt');
const passport = require('passport');
const logout = require('express-passport-logout');
exports.auth_signup = [
    // Validate and sanitise fields.
    body('link').trim().isLength({ min: 1 }).withMessage('must not be empty')
    .isLength({ max: 50}).withMessage('must be less than 50 chracters') ,
    body('email', 'must be a valid email').trim().isEmail() ,
    body('password', 'must be between 8 and 50 characters long').trim().isLength({ min: 8, max: 50}) ,

    // Process request after validation and sanitization.
    async (req,res,next) => {
    
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //Check if link already exists
        const link = await User.findOne({link: req.body.link})
        if (link) return res.status(400).send('Link is already used')
        //Check if email already exists
        const emailExist = await User.findOne({email: req.body.email});
        if (emailExist) return res.status(400).send('There already is an account connected to this email');

        //Create new user
        const user = new User({
            username: req.body.link,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            link: req.body.link
        });
        try{
            await user.save();
            const token = issueJWT(user._id);
            //Respond with authentification token
            
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
            })
            user.password = undefined
            return res.status(201).json(user)
        } catch(err){
            return res.status(400).send(err);
        }
    }
];

exports.auth_login = [
    // Validate and sanitise fields.
    body('email', 'must be a valid email').trim().isEmail() ,
    body('password', 'must be between 8 and 50 characters long').trim().isLength({ min: 8, max: 50}) ,

    // Process request after validation and sanitization.
    async (req,res,next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        //Checking if email exits
        const user = await User.findOne({email: req.body.email}).select('+password');
        if (!user) return res.status(400).send('Email or password is incorrect');
        //Checling password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Email or password is incorrect');

        //Respond with authentification token
        const token = issueJWT(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
        })
        user.password = undefined
        return res.status(200).json(user);
    }
];

exports.auth_logOut = (req,res,next) => {
    res.clearCookie('jwt')
    return res.status(200).json('Logged out succesfully')
}

// exports.auth_checkIfLoggedIn = (req,res,next) => {



//     loggedIn = req.user ? true : false
//     return res.status(200).json({loggedIn: loggedIn})
// }



// exports.auth_checkIfLoggedIn = passport.authenticate(['jwt'], (err, user) =>{
//     if (err) return res.status(400).json({message:'failed to authentificate', loggedIn: false})
//     if (user) return res.status(200).json({message:'authentification succesful', loggedIn: true})
//     else return res.status(200).json({loggedIn: false})
// })

exports.auth_checkIfLoggedIn = function(req, res, next) {

    // generate the authenticate method and pass the req/res
    passport.authenticate(['jwt'], {session: false}, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(200).json(false)}
  
      // req / res held in closure
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        const user = req.user
        user.password = undefined;
        return res.status(200).json(user)
      });
  
    })(req, res, next);
};