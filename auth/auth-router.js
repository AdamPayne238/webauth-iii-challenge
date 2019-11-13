const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');

const { validateUser } = require('../users/users-helpers')
// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  // always validate the data before sending it to the database
const validateResult = validateUser(user)

if(validateResult.isSuccessful === true){
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
}else {
  res.status(400).json({ 
    message: 'invalid information about user',
    errors: validateResult.errors
  })
}
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //produce a token
        const token = getJwtToken(user.username);
        //send the token to the client
        res.status(200).json({
          message: `Welcome ${user.username} take this token!!! (dont try to modify it ^.~)`,
          token //return token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function getJwtToken(username){
  //make sure that no one has made changes to the token
  const payload ={
    username,
    role: 'user' // this will rpobably come from the database
  }
  const secret = process.env.JWT_SECRET || 'is it secret? is it safe?';
  const options = {
    //how long will this be valid?
    expiresIn: '1d'
  }


  return jwt.sign(payload, secret, options);
}

module.exports = router;
