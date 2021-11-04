const passport = require('passport');
const response = require("../../response");
const User = require('../../models/user');
const logger = require('../../config/winston');

//post('/auth/token')
const create = async (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.log(authError);
      logger.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        logger.error(loginError);
        console.error(loginError);
        return next(loginError);
      }
      logger.info('post auth/token success');
      return res.redirect('/verify');
    });
  })(req, res, next);
}

//get('/auth/token')
const verify = async (req, res, next) => {
  //관리자라면
  if (req.user.dataValues.isAdmin) return response(res, 200);

  //일반 사용자라면
  const loginId = req.user.dataValues.loginId;
  if (!loginId) {
    logger.error('cannot find login id');
    return response(res, 400, 'cannot find login id');
  }
  const commentId = req.query.commentId;
  if (!commentId) {
    logger.error('cannot find comment id');
    return response(res, 400, 'cannot find comment id');
  }

  //댓글 작성자 != 로그인 아이디
  if (commentId != loginId) {
    logger.error('No authentication');
    return response(res, 403, 'No authentication');
  }
  logger.info('get auth/token success');
  return response(res, 200);
}
//patch('auth/levelup')
const levelup = async (req, res, next) => {
  //관리자가 아니라면
  if (!req.user.dataValues.isAdmin) {
    logger.error('No authentication');
    return response(res, 403, 'No authentication');
  }

  const loginId = req.body.loginId;
  const user = await User.update({
    isAdmin: true
  }, {
    where: { loginId: loginId }
  }).catch((err) => {
    logger.error(err);
    console.error(err);
    return next(err);
  });

  if (!user) {
    logger.error('user is not exist');
    return response(res, 400, 'user is not exist');
  }
  logger.info('post auth/levelup success');
  return response(res, 200, user);
}
module.exports = {
  create,
  verify,
  levelup
}