const passport = require('passport');

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

module.exports = {
  create
}