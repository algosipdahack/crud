const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const SECRET = config.secret_key;

exports.verifyToken = (req, res, next) => {
    try {
        let token = req.cookies['user'];
        req.decoded = jwt.verify(token, SECRET);
        return next();
    } catch (error) {
        return next();
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        //res.status(403).json({ status: false, result: '로그인 필요' });
        res.redirect('/');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};