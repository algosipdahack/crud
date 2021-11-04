const response = require("../../../response");
const User = require('../../../models/user');
const Comment = require('../../../models/comment');
const bcrypt = require('bcrypt-nodejs');
const logger = require('../../../config/winston');

//get('/users')
const readAll = async (req, res, next) => {
  const users = await User.findAll().catch((err) => {
    console.error(err);
    logger.error(err);
    return next(err);
  });
  return res.json(users);
}

//post('/users')
const register = async (req, res, next) => {
  const { loginId, pw, name, age, married, isAdmin } = req.body;

  const result = await User.count({
    where: {
      loginId: loginId
    }
  }).catch((e) => {
    logger.error(e);
    return res.redirect('/join?error=exist');
  });

  if (result === 1) {
    logger.error("userid already exist");
    return response(res, 304, "userid already exist");
  }
  else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        logger.error("Bcrypt genSalt error");
        return response(res, 500, "Bcrypt genSalt error");
      }
      else {
        bcrypt.hash(pw, salt, null, (err, hash) => {
          if (err) {
            logger.error("Bcrpyt hashing error");
            return response(res, 500, "Bcrpyt hashing error");
          }
          else {
            User.create({
              loginId,
              pw: bcrypt.hashSync(pw),
              name,
              age,
              married,
              isAdmin
            }).catch((e) => {
              console.error(e);
              logger.error(e);
              return next(e);
            });
            logger.info("register success");
            return response(res, 201, "register success");
          }
        });
      }
    })
  }
}

//get('/users/:id')
const read = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({
    where: { loginId: id, deletedAt: null },
  }).catch((err) => {
    console.error(err);
    logger.error(err);
    return next(err);
  });

  if (!user) {
    logger.error('user is not exist');
    return response(res, 400, 'user is not exist');
  }
  logger.info('get /users/id success');
  return response(res, 200, user);
}

//patch('/users/:id')
const update = async (req, res, next) => {
  const loginId = req.user.dataValues.loginId; //현재 로그인된 아이디
  const id = req.params.id;

  if (loginId != id && !req.user.dataValues.isAdmin) {
    logger.error('No Authentication');
    return response(res, 403, 'No Authentication');
  }

  const result = await User.update({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  }, {
    where: { loginId: id },
  }).catch((err) => {
    logger.error(err);
    console.error(err);
    return next(err);
  });

  if (!result) {
    logger.error('cannot find id');
    return response(res, 400, 'cannot find id');
  }
  logger.info('patch /users/id success');
  return response(res, 200, result);
}

//delete('/users/:id')
const remove = async (req, res, next) => {
  const loginId = req.user.dataValues.loginId; //현재 로그인된 아이디
  const id = req.params.id;

  if (loginId != id && !req.user.dataValues.isAdmin) {
    logger.error('No Authentication');
    return response(res, 403, 'No Authentication');
  }

  const result = User.destroy({
    where: { loginId: id },
  }).catch((e) => {
    logger.error(err);
    console.error(err);
    return next(err);
  });

  if (!result) return response(res, 400, 'cannot find id');
  logger.info('delete /users/id success');
  return response(res, 200);
}

//get('/users/logout')
const logout = async (req, res, next) => {
  req.logout();
  req.session.destroy();
  logger.info('logout success');
  res.redirect('/login');
}

//ERROR
//get('/users/:id/comments')
const commentRead = async (req, res, next) => {
  const id = req.params.id;

  //존재하는 유저인지 확인
  const user = await User.findOne({
    where: {
      id: id,
      deletedAt: null
    }
  });
  if (!user) {
    logger.error('cannot find user');
    return response(res, 400, 'cannot find user');
  }


  const comments = await Comment.findAll({
    include: {
      model: User,
      where: {
        id: id,
        //parentId: null
      }
    }
  }).catch((err) => {
    logger.error(err);
    console.error(err);
    return next(err);
  });
  if (!comments) return response(res, 400, 'cannot find comment');
  logger.info('get /users/id/comments success');
  return res.json(comments);
}

module.exports = {
  readAll,
  register,
  read,
  update,
  logout,
  remove,
  commentRead
}