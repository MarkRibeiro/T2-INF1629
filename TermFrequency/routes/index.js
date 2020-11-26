var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var TermFrequency = require('../tf.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download', function (req, res, next) {
  res.download('output.txt');
});

router.post('/', function (req, res) {
  var form = new multiparty.Form();
  var tf = new TermFrequency();

  form.parse(req, function (err, fields, files) {
    tf.init(files.input_file[0].path, files.ignore_file[0].path);
  });

  res.render('file');
});

module.exports = router;
