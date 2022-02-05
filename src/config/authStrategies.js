const JwtStrategy = require('passport-jwt').Strategy;
const User = require("../models/user");
const passport = require('passport');

const publicKey = require('base-64').decode(process.env.PUBLIC_KEY);

const cookieExtractor = (req)  => {
  let token = null;
  if (req && req.cookies)
  {
      token = req.cookies['jwt'];
      
  }
  return token;
};

const opts = {}
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = publicKey;
opts.algorithms = ['RS256']
module.exports.jwtStrategy = new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({ _id: jwt_payload.id }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
});

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
