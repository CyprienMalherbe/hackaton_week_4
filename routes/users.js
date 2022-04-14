var express = require('express');
var router = express.Router();

var userModel = require('../models/users');

router.post('/sign-up', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.signupmail
  })
  
  if(!searchUser){
    var newUser = new userModel({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.signupmail,
      password: req.body.signuppassword,
    })
  
    var newUserSave = await newUser.save();
  
    // req.session.user = {
    //   name: newUserSave.username,
    //   id: newUserSave._id,
    // }
  
    res.redirect('/search')
  } else {
    res.redirect('/')
  }
  
});

router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.signinmail,
    password: req.body.signinpassword
  })

  if(searchUser!= null){
    // req.session.user = {
    //   name: searchUser.username,
    //   id: searchUser._id
    // }
    res.redirect('/search')
  } else {
    res.render('index')
  }

  
});

module.exports = router;
