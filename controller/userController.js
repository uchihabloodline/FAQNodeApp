const User = require('../models/user');
const Moderator = require('../models/moderators');
const path = require('path')
const fs = require('fs');


//sign-up
module.exports.signUp = function(req,res){
    return res.render('user-signup',{
        title:  'FAQ Sign-Up',
    });
};

//sign-in
module.exports.signIn = function(req,res){
    //signing-In User to home page
    return res.render('user-signin',{
        title:  'FAQ Sign-In',
    });
};

//for singin user
module.exports.createSession = function(req,res){
    //redirecting to home page
    req.flash('success','Successfully Logged In');
    console.log('success','Successfully Logged In');
    return res.redirect('/');
};

//sign-out
module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        console.log('success','You have logged out');
        req.flash('success','You have logged out');
        return res.redirect('/');
      });
};

//For Sign-Up user
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        console.log("password mismatch");
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    // If email does not exist in Moderator model then it should fail signup/signin.
    Moderator.findOne({email: req.body.email}, function(err, user){
        if(err){
            req.flash('Email/Username does not exists for Moderator privilege');
            console.log('Email does not exist in Moderator model');
            return res.redirect('/');
        }
        if(!user){
            console.log('Email does not exist for moderator privileges');
            return res.redirect('back');
        }
    
    // After checking Moderator DB, proceed with creating user.
    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            req.flash('error finding user', err);
            console.log("Error in finding user in the User DB");
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("error in creating the user while signing-up!!"+err);
                    return;
                }
            return res.redirect('/user/sign-in');
            });
        }else{
            req.flash('error','User already present');
            console.log("User already Present!!");
            return res.redirect('back');
        }
    });
});
};