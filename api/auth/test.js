const express = require('express');
const { verifyToken } = require('../../routes/middlewares');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    const loginId = req.query.loginId;
    const user = User.findAll();
    res.render('verify', { user: user, loginId: loginId });
});
module.exports = router;