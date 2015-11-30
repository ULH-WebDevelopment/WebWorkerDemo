var express = require('express'),
  app = express(),
  port = 1234;

app.use(express.static('public'));

var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
