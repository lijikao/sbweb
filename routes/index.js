var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let backendBaseUrl = (process.env.BACKEND_API_BASE_URL || 'https://bps-mynodesql-api.blcksync.info:444/v0'); //(process.env.BACKEND_API_BASE_URL || 'http://localhost:3000/v0/query');
  res.render('index', { title: 'Express', backendBaseUrl: backendBaseUrl });
});

module.exports = router;
