var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('intro');
});
router.get('/home', function(req, res, next) {
  res.render('index');
});

module.exports = router;
