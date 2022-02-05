const jwt = require("jsonwebtoken");

const privateKey = require('base-64').decode(process.env.PRIVATE_KEY);



module.exports.issueJWT = (user) => {
    const _id = user._id;
    const expiresIn = "1d";
  
    const payload = {
      id: _id,
      iat: Date.now(),
    };
  
    const signedToken = jwt.sign(payload, privateKey,  {
      algorithm: 'RS256',
      expiresIn: expiresIn
    });
    const token = {
      token: signedToken,
      expires: expiresIn,
    }
    return signedToken;
};
