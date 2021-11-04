const { isLoggedIn, isNotLoggedIn } = require('../routes/middlewares');
const User = require('../models/user');
var express = require('express');
const router = express.Router();

router.get('/', isNotLoggedIn, async (req, res, next) => {//login.html로 라우팅
    const users = await User.findAll().catch((err) => {
        console.error(err);
        next(err);
    });
    res.render('login', { users });
});
module.exports = router;