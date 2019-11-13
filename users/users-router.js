const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

//add check role 
router.get('/', restricted, checkRole('user', 'admin'), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;

//check role
function checkRole(roles){
  return function (req, res, next){
    if(roles.includes(req.decodedJwt.role)){
      next();
    } else {
      res.status(403).json({ message: "you have no access!"})
    }
  }
}
