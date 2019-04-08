var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
});

//Get measurements page
router.get('/measure', function(req, res, next) {
  res.render('measure', { title: 'How to take measurements' });
});

module.exports = router;
