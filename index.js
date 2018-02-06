var express = require('express');
var w = express();


w.get('/ssr', function (req, res) {
  var riot = require('riot')
  var app = require('./docs/tags/w-app/w-app.tag')

  res.send(riot.render(app));
});


w.use(express.static('docs'));


w.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
