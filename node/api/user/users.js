const response = require("../../response");
const User = require('../../models/user');
const Comment = require('../../models/comment');
const bcrypt = require('bcrypt-nodejs');

//get('/users')
const readAll = async (req, res, next) => {
  const users = await User.findAll().catch((err) => {
    console.error(err);
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
    return res.redirect('/join?error=exist');
  });

  if (result === 1) {
    return response(res, 304, "userid already exist");
  }
  else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return response(res, 500, "Bcrypt genSalt error");
      }
      else {
        bcrypt.hash(pw, salt, null, (err, hash) => {
          if (err) {
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
              return next(e);
            });
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
    return next(err);
  });

  if (!user) return response(res, 400, 'user is not exist');
  return response(res, 200, user);
}

//patch('/users/:id')
const update = async (req, res, next) => {
  const loginId = req.user.dataValues.loginId; //현재 로그인된 아이디
  const id = req.params.id;
  
  if (loginId != id && !req.user.dataValues.isAdmin) return response(res, 403, 'No Authentication');

  const result = await User.update({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  }, {
    where: { loginId: id },
  }).catch((err) => {
    console.error(err);
    return next(err);
  });

  if (!result) return response(res, 400, 'cannot find id');
  return response(res, 200, result);
}

//delete('/users/:id')
const remove = async (req, res, next) => {
  const loginId = req.user.dataValues.loginId; //현재 로그인된 아이디
  const id = req.params.id;
  
  if (loginId != id && !req.user.dataValues.isAdmin) return response(res, 403, 'No Authentication');
  
  const result = User.destroy({
    where: { loginId: id },
  }).catch((e) => {
    console.error(err);
    return next(err);
  });

  if (!result) return response(res, 400, 'cannot find id');
  return response(res, 200);
}

//get('/users/logout')
const logout = async (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
}

//get('/users/:id/comments')
const commentRead = async (req, res, next) => {
  const id = req.params.id;

  //존재하는 유저인지 확인
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { id: id },
        { deletedAt: null }
      ]
    }
  });
  if (!user) return response(res, 400, 'cannot find user');


  const comments = await Comment.findAll({
    include: {
      model: User,
      where: {
        [Op.and]: [
          { id: id },
          { parentId: null }
        ]
      }
    }
  }).catch((err) => {
    console.error(err);
    return next(err);
  });
  if (!comments) return response(res, 400, 'cannot find comment');
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