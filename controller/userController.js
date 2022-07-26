const User = require('../models/user');
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
    
    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            req.flash('error finding user', err);
            console.log("Error in finding user in the DB");
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
};