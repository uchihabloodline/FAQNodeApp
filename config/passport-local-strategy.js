/* eslint-disable no-undef */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport.js

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true,
  },
  ((req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        // eslint-disable-next-line no-useless-concat
        logger.error({ message: 'error in passport find user. ' + `Error: ${JSON.stringify(err)}` });
        return done(err);
      }
      // eslint-disable-next-line eqeqeq
      if (!user || user.password != password) {
        logger.error({ message: 'Error: Invalid Username/Password' });
        return done(null, false);
      }

      return done(null, user);
    });
  }),
));

// serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the id in the cookie sent through serialized way
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      logger.error({ message: 'error in finding the user!!' });
      return done(err);
    }
    return done(null, user);
  });
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect('/user/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    /*
    req.user contains the current signed in user from the session cookie
    and we are just sending this to the locals for the views
    */
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
