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