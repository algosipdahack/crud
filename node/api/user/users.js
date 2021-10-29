const response = require("../../response");
const User = require('../../models/user');
const Comment = require('../../models/comment');
const bcrypt = require('bcrypt-nodejs');


const readAll = async (req, res, next) => {
  const users = await User.findAll().catch((err) => {
    console.error(err);
    return next(err);
  });
  return res.json(users);
}

const register = async (req, res, next) => {
  const { loginId, pw, name, age, married } = req.body;

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
              married
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

const read = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({
    where: { id: id },
  }).catch((err) => {
    console.error(err);
    return next(err);
  });

  if (!user) return response(res, 400, 'user is not exist');
  return response(res, 200, user);
}

const update = async (req, res, next) => {
  const result = await User.update({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  }, {
    where: { id: req.params.id },
  }).catch((err) => {
    console.error(err);
    return next(err);
  });

  if (!result) return response(res, 400, 'cannot find id');
  return response(res, 200, result);
}

const remove = async (req, res, next) => {
  const result = User.destroy({
    where: { loginId: id },
  }).catch((e) => {
    console.error(err);
    return next(err);
  });

  if (!result) return response(res, 400, 'cannot find id');
  return response(res, 200);
}

const logout = async (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
}

const commentRead = async (req, res, next) => {
  const comments = await Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id },
    },
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