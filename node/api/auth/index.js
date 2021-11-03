const passport = require('passport');
const response = require("../../response");

//post('/auth/token')
const create = async (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.log(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
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
  if (!loginId) return response(res, 400, 'cannot find login id');
  const commentId = req.query.commentId;
  if (!commentId) return response(res, 400, 'cannot find comment id');

  //댓글 작성자 != 로그인 아이디
  if (commentId != loginId) return response(res, 403, 'No authentication');
  return response(res, 200);
}

module.exports = {
  create,
  verify
}