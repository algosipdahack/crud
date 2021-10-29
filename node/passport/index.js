const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { //로그인 시 실행됨
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => { //매 요청 시 실행됨
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local();
};