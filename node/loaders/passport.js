const passport = require('passport');
const passportConfig = require('../passport');
const session = require('express-session');

module.exports = async ({ app }) => {
    passportConfig();
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    return app;
}