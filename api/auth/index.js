var express = require('express');
const User = require('../../models/user');
const config = require('../../config/config.json');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const SECRET = config.secret_key;
router.get('/',async(req,res,next)=>{//get방식 라우터
  try{
    const users = await User.findAll();
    res.render('sequelize',{users});
  }catch(err){
    console.error(err);
    next(err);
  }
});
router.post('/login',async(req,res,next)=>{
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
                if(result === true){//로그인 성공
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
});
router.post('/register',async(req,res,next)=>{
  try{
    const loginId = req.body.loginId;
    const pw = req.body.pw;
    const name = req.body.name;
    const age = req.body.age;
    const married = req.body.married;
    const users = await User.findAll();
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
                            const user = User.create({
                                loginId: loginId,
                                pw: bcrypt.hashSync(pw),
                                name: name,
                                age : age,
                                married : married
                            })
                            console.log(user);
                            res.status(201).json({status:true,result:"register success"});
                            res.render('login',{users});
                        }
                    });
                }
            })
        }
    })
  } catch(e){
    res.status(500).json({status:false,result:"register error"});
  }
});
module.exports = router;
