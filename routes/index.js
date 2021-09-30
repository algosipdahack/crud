var express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/',async(req,res,next)=>{//get방식 라우터
  try{
    const users = await User.findAll();
    res.render('sequelize',{users});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;
