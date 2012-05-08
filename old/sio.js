var io = require('socket.io').listen(8080);
//io.set('log level', 1);
io.disable('heartbeats');
//io.set('cloase timeout', 0);
//io.set('heartbeat timeout', 0);

io.sockets.on('connection', function (socket) {
  socket.join('foo');
});


setInterval(function(){
    io.sockets.in('foo').emit('bar', 'new mail');
}, 5000);

