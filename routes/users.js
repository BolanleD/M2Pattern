const express = require('express');
const router = express.Router();

let register = require('./users/register');
let login = require('./users/login');
let reset_password = require('./users/reset_password');
let profile = require('./users/profile');
let search_user = require('./users/search_user');


router.use('/', register);
router.use('/', login);
router.use('/', reset_password);
router.use('/', search_user);
router.use('/', profile);


module.exports = router;