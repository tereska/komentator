var stats = 0;

var http = require('http');

var srv = http.createServer(function (req, res) {
  stats += 1;
  var interval = null;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('hello!');
  req.on('close', function(){
    stats -= 1;
    clearInterval(interval);
  });
  interval = setInterval(function(){
    res.write('ping');
  }, 5000);
});

srv._backlog = 100000;
srv.listen(8080, '0.0.0.0');


setInterval(function(){
  console.log(stats);
},1000);

