const { isLoggedIn, isNotLoggedIn } = require('../routes/middlewares');
const User = require('../models/user');
var express = require('express');
const router = express.Router();

router.get('/', isNotLoggedIn, async (req, res, next) => {//get방식 라우터
    const users = await User.findAll().catch((err) => {
        console.error(err);
        next(err);
    });
    res.render('sequelize', { users });
});
module.exports = router;