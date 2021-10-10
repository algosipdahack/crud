const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const SECRET = config.secret_key;

exports.verifyToken = (req,res,next)=>{
    try{
        let token = req.cookies['user'];
        req.decoded = jwt.verify(token,SECRET);
        return next();
    }catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(419).json({
                code:419,
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code:401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};