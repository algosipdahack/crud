const passport = require('passport');
const response = require("../../response");

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

const verify = async (req, res, next) => {
  const commentId = req.query.commentId;
  if (!commentId) return response(res, 400, 'cannot find comment id');
  const loginId = req.user.dataValues.loginId;
  if (!loginId) return response(res, 400, 'cannot find login id');

  if (commentId != loginId) return response(res, 403, 'No authentication');
  return response(res, 200);
}
module.exports = {
  create,
  verify
}