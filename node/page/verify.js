const { isLoggedIn, isNotLoggedIn } = require('../routes/middlewares');
const User = require('../models/user');
var express = require('express');
const router = express.Router();

router.get('/verify', isLoggedIn, async (req, res, next) => {//verify.html로 라우팅
    const loginId = req.query.loginId;
    const users = await User.findAll().catch((err) => {
        console.error(err);
        next(err);
    });
    res.render('verify', { users, loginId: loginId });
});

module.exports = router;