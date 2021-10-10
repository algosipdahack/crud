var express = require('express');
const User = require('../../models/user');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const {verifyToken} = require('../../routes/middlewares');
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

router.get('/login', async(req,res,next)=>{//get방식 라우터
  try{
    const users = await User.findAll();
    res.render('login',{users});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/test',verifyToken,(req,res)=>{
  const loginId = req.query.loginId;
  const user = User.findAll();
  res.render('verify',{user: user, loginId : loginId});
});

router.post('/token',async(req,res,next)=>{
    const loginId = req.body.loginId;
    const pw = req.body.pw;
    const user = await User.findOne({
        where: {
            loginId : loginId,
        },
    }).catch((e) =>
      {
        console.log(e);
        res.status(500).json({status: false, result:'login error'});
      }
    )
    if(user != null){ //유저가 존재한다면
      bcrypt.compare(pw,user.pw,(err,result)=>{
          if(result === true){//로그인 성공
              const token = jwt.sign({//토큰 발급
                  loginId : loginId
              }, SECRET,{
                  algorithm:'HS256',
                  expiresIn: '10m'
              })
              //쿠키로 저장
              res.cookie('user',token,{httpOnly: true, maxAge:24*60*60*1000});
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

router.get('/logout',(req,res)=>{
  res.clearCookie('user');
  res.redirect('/');
});

router.post('/register', async(req,res,next)=>{
  try{
    const loginId = req.body.loginId;
    const pw = req.body.pw;
    const name = req.body.name;
    const age = req.body.age;
    const married = req.body.married;
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
