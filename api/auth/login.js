var express = require('express');
const User = require('../../models/user');
const passport = require('passport');
const router = express.Router();
const { verifyToken, isLoggedIn, isNotLoggedIn } = require('../../routes/middlewares');


router.get('/', async (req, res, next) => {//login.html로 라우팅
    const users = await User.findAll().catch((err) => {
        console.error(err);
        next(err);
    });
    res.render('login', { users });
});

router.post('/token', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.log(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/verify');
        });
    })(req, res, next);
});
module.exports = router;