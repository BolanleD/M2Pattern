const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

// Get Users Model
var User = require('../../models/user');

// Register Form
router.get('/register', function(req, res) { 
  res.render('register');
});

// Register Proccess
router.post('/register', [
  check('name')
  .not()
  .isEmpty()
  .withMessage('Name is required')
  .custom(( value ) => value.length > 1)
  .withMessage('Name is too short'),
  check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid Email')
  .custom((value, {req}) => {
    return new Promise((resolve, reject) => {
      User.findOne({email:req.body.email}, (err, user) => {
        if(err) {
          reject(new Error('Server Error'))
        }
        if(Boolean(user)) {
          reject(new Error('Email already in use'))
        }
        resolve(true)
      });
    });
  }),
  check('username')
  .not()
  .isEmpty()
  .withMessage('Username is required')
  .custom(( value ) => value.length > 2)
  .withMessage('Username is too short')
  .custom((value, {req}) => {
    return new Promise((resolve, reject) => {
      User.findOne({username:req.body.username}, (err, user) =>{
        if(err) {
          reject(new Error('Server Error'))
        }
        if(Boolean(user)) {
          reject(new Error('Username already in use'))
        }
        resolve(true)
      });
    });
  }),
  check('password')
  .not()
  .isEmpty()
  .withMessage('Password is required')
  .custom(( value ) => /[A-Z]/.test(value))
  .withMessage('Password should contain at least one capital letter')
  .custom(( value ) => /[0-9]/.test(value))
  .withMessage('Password should contain at least one numeric character')
  .custom(( value ) => value.length > 5)
  .withMessage('Password is too short'),
  check('password2', 'Passwords do not match')
  .exists()
  .custom((value, { req }) => value === req.body.password)
], function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const role = req.body.role;
  
  const validationErrors = validationResult(req);
  let errors = [];
  if (!validationErrors.isEmpty()) {
    Object.keys(validationErrors.mapped()).forEach(field => {
      errors.push(validationErrors.mapped()[field]['msg']);
    });
  }

  if (errors.length) {
    req.flash('danger', errors);
    res.redirect('/users/register');
  } else {

    let newUser = new User({
      name: name,
      email: email,
      username:username,
      password:password,
      createdOn: new Date(),
      role:Number.parseInt(req.body.role),     
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

module.exports = router;