/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const fs = require('fs');
const _ = require('lodash');
const Moderator = require('../models/moderators');
const User = require('../models/user');

// sign-up
module.exports.signUp = function (req, res) {
  return res.render('user-signup', {
    title: 'FAQ Sign-Up',
  });
};

// sign-in
module.exports.signIn = async function (req, res) {
  // check for override login activity.
  if (!_.isEmpty(req.user)) {
    // eslint-disable-next-line eqeqeq
    if (req.user.email != req.body.email) {
      req.flash('error', 'Already logged in with another session');
      // eslint-disable-next-line no-undef
      logger.warn({ message: `user with email: ${req.user.email} already logged in.` });
      return await res.status(200).json({
        message: 'Another session in progress',
        failureRedirect: res.redirect('/')
      });
    }
  }
  // signing-In User to home page
  return await res.render('user-signin', {
    title: 'FAQ Sign-In',
    message: 'sign-in execution successful'
  });
};

// for singin user
module.exports.createSession = function (req, res) {
  // redirecting to home page
  req.flash('success', 'Successfully Logged In');
  console.log('Successfully Logged In');
  // eslint-disable-next-line no-undef
  logger.info({ message: `User: ${req.user} successfully logged-in` });
  return res.redirect('/');
};

// sign-out
module.exports.destroySession = function (req, res) {
  req.logout((err) => {
    if (err) {
      // eslint-disable-next-line no-undef
      logger.error({ meesage: `Error in destroySession function. Error: ${JSON.stringify(err)}` });
      // eslint-disable-next-line no-undef
      return next(err);
    }
    console.log('You have logged out');
    // eslint-disable-next-line no-undef
    logger.info({ meesage: 'User has logged out.' });
    req.flash('success', 'You have logged out');
    return res.redirect('/');
  });
};

// For Sign-Up user
// eslint-disable-next-line func-names
module.exports.create = async function (req, res) {
  // eslint-disable-next-line eqeqeq
  if (req.body.password != req.body.confirm_password) {
    console.log('password mismatch');
    // eslint-disable-next-line no-undef
    logger.error({ meesage: 'User passoword mis-match during user creation.' });
    req.flash('error', 'Passwords do not match');
    return await res.status(200).json({
      message: 'password do not match',
      failureRedirect: res.redirect('back')
    });
  }

  // If email does not exist in Moderator model then it should fail signup/signin.
  Moderator.findOne({ email: req.body.email }, async (err, user) => {
    if (err) {
      req.flash('error', 'Error occured with system. Please try again.');
      // eslint-disable-next-line no-undef
      logger.error({ meesage: `Error in finding user in Moderator model. Error: ${JSON.stringify(err)}` });
      console.log('Error in finding user in Moderator model');
      return await res.redirect('/');
    }
    if (!user) {
      req.flash('error', 'Email/Username does not exists for Moderator privilege');
      console.log('Email does not exist for moderator privileges');
      // eslint-disable-next-line no-undef
      logger.error({ meesage: 'Email does not exist for moderator privileges' });
      return await res.status(200).json({
        message: 'Email does not exist in Moderator model',
        failureRedirect: res.redirect('back')
      });
    }

    // After checking Moderator DB, proceed with creating user.
    // eslint-disable-next-line consistent-return
    // eslint-disable-next-line no-shadow
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        req.flash('error', 'Error in finding user. Try Again.');
        console.log('Error in finding user in the User DB');
        logger.error({ meesage: `Error in finding user in the User DB. Error: ${JSON.stringify(err)}` });
        return res.redirect('/user/sign-up');
      }
      if (!user) {
        User.create(req.body, (err, user) => {
          if (err) {
            req.flash('error', 'error in creating the user. Try Again.');
            console.log(`error in creating the user while signing-up!! ${err}`);
            logger.error({ meesage: `Error in creating user while signing-up. Error: ${JSON.stringify(err)}` });
            return res.redirect('back');
          }
          req.flash('success', 'User Sign-up successful');
          return res.redirect('/user/sign-in');
        });
      } else {
        req.flash('error', 'User already present');
        logger.debug({ message: 'User already present in User model.' });
        console.log('User already Present!!');
        return res.redirect('back');
      }
    });
  });
};
