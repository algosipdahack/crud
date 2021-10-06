const jwt  = require('jsonwebtoken');
const User = require('../../models/index');
const config = require('../../config/config.json');
const bcrypt = require('bcrypt-nodejs');
const SECRET = config.secret_key;

async function login() {
    try{
        const{loginId,pw} = req.body;
        User.find({
            attributes: ['pw'],
            where: {
                loginId : loginId,
            }
        })
        .then(queryResult =>{
            if(queryResult != null){ //유저가 존재한다면
                bcrypt.compare(pw,queryResult.pw,(err,result)=>{
                    if(result === true){
                        const token = jwt.sign({
                            loginId : loginId
                        }, SECRET,{
                            algorithm:'HS256',
                            expiresIn: '10m'
                        })
                        res.status(200).json({status: true, token: token});
                    }else if(err){
                        res.status(500).json({status:false,result:"Bcrypt error"});
                    }else{
                        res.status(401).json({status:false,result:"incorrect password"});
                    }
                })
            } else{
                res.status(404).json({status:false, result:"user does not exist"});
            }
        });
    } catch(e){
        console.log(e);
        res.status(500).json({status: false, result:'login error'});
    }
}
async function register() {
    try{
        const{loginId,pw,name,age,married} = req.body;

        User.count({
            where:{
                loginId: loginId
            }
        }).then(result =>{
            if(result === 1){
                res.status(304).json({status: false, result : "userid already exist"})
            }else{
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err){
                        res.status(500).json({status:false,result:"Bcrypt genSalt error"});
                    }else{
                        bcrypt.hash(pw,salt,null,(err,hash)=>{
                            if(err){
                                res.status(500).json({status:false, result:"Bcrpyt hashing error"});
                            }
                            else{
                                console.log(hash);
                                User.create({
                                    loginId: loginId,
                                    pw: bcrypt.hashSync(pw),
                                    name: name,
                                    age : age,
                                    married : married
                                })
                                res.status(200).json({status:true,result:"register success"});
                            }
                        });
                    }
                })
            }
        })
    } catch(e){
        res.status(500).json({status:false,result:"register error"});
    }
}