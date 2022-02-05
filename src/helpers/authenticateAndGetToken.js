const jwt = require("jsonwebtoken");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require('passport');

module.exports = [passport.authenticate(['jwt']),
  async (req, res, next) => {
    if (!req.user) {
      const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
      if (cur){
        const payload = jwt.verify(jwtFromRequest(req), process.env.JWT_SECRET);
        req.payload = payload;
      }
    } else {
      req.payload = req.user;
    }
    next();
  }
];