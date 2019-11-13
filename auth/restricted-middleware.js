// const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // const { username, password } = req.headers;
  const token = req.headers.authorization; // send token in header 

  if (token) {
    const secret = process.env.JWT_SECRET || 'is it secret? is it safe?';
    //check that token is valid (un modified)
    jwt.verify(token, secret, (err, decodedToken) => {
      if(err){
        //token was tampered with
        res.status(401).json({ message: 'invalid cred'})
      }else {
        req.decodedJwt = decodedToken;
        next();
      }
    })
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};


