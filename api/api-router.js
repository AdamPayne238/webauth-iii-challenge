const router = require('express').Router();

const bcrypt = require('bcryptjs');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../users/users-router');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
    res.json({ api: "API!", session: req.session});
});

router.post('/hash', (req, res) => {
    //read a password from the body
    //hash the password
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 12);
    //return to user in an object that lookslike { password: 'original password, hash: 'hashed password' }
    res.status(200).json({ password, hash})
})

module.exports = router;