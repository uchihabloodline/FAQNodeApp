const User = require('../models/user');
const Moderator = require('../models/moderators');
const path = require('path')
const fs = require('fs');
const _ = require('lodash');
const loggerConfigLog4js = require('../config/loggerConfigLog4js');


//sign-up
module.exports.signUp = function(req,res){
    return res.render('user-signup',{
        title:  'FAQ Sign-Up',
    });
};

//sign-in
module.exports.signIn = function(req,res){
   
    // check for override login activity.
    if(!_.isEmpty(req.user)){
        if(req.user.email != req.body.email){
            req.flash('error', 'Already logged in with another session');
            logger.warn({message: `user with email: ${req.user.email} already logged in.`});
            return res.redirect('/');
        }
    }
    //signing-In User to home page
    return res.render('user-signin',{
        title:  'FAQ Sign-In',
    });
};

//for singin user
module.exports.createSession = function(req,res){
    //redirecting to home page
    req.flash('success','Successfully Logged In');
    console.log('Successfully Logged In');
    logger.info({message: `User: ${req.user} successfully logged-in`});
    return res.redirect('/');
};

//sign-out
module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) {
            logger.error({meesage: `Error in destroySession function. Error: ${JSON.stringify(err)}`});
            return next(err); 
        }
        console.log('You have logged out');
        logger.info({meesage: `User has logged out.`});
        req.flash('success','You have logged out');
        return res.redirect('/');
      });
};

//For Sign-Up user
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        console.log("password mismatch");
        logger.error({meesage: `User passoword mis-match during user creation.`});
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    // If email does not exist in Moderator model then it should fail signup/signin.
    Moderator.findOne({email: req.body.email}, function(err, user){
        if(err){
            req.flash('error', 'Error occured with system. Please try again.');
            logger.error({meesage: `Error in finding user in Moderator model. Error: ${JSON.stringify(err)}`});
            console.log('Error in finding user in Moderator model');
            return res.redirect('/');
        }
        if(!user){
            req.flash('error', 'Email/Username does not exists for Moderator privilege');
            console.log('Email does not exist for moderator privileges');
            logger.error({meesage: `Email does not exist for moderator privileges`});
            return res.redirect('back');
        }
    
    // After checking Moderator DB, proceed with creating user.
    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            req.flash('error', 'Error in finding user. Try Again.');
            console.log("Error in finding user in the User DB");
            logger.error({meesage: `Error in finding user in the User DB. Error: ${JSON.stringify(err)}`});
            return res.redirect('/user/sign-up');
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    req.flash('error', 'error in creating the user. Try Again.');
                    console.log("error in creating the user while signing-up!! "+err);
                    logger.error({meesage: `Error in creating user while signing-up. Error: ${JSON.stringify(err)}`});
                    return res.redirect('back');
                }
                req.flash('success', 'User Sign-up successful');
            return res.redirect('/user/sign-in');
            });
        }else{
            req.flash('error','User already present');
            logger.debug({message: `User already present in User model.`});
            console.log("User already Present!!");
            return res.redirect('back');
        }
    });
});
};