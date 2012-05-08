var net = require('net');
var sockets = [];
var stats = 0;

var handler = function(data){
  stats += 1;
}

var createInterval = setInterval(function(){
  if(sockets.length >= process.argv[2]){
    clearInterval(createInterval);
    return;
  }
  var socket = new net.Socket({type: 'tcp4'});
  sockets.push(socket);
  socket.on('data', handler);
  socket.connect(8080, function(){
    socket.write('GET /\r\n\r\n');
  });
},1);


setInterval(function(){
  console.log('Stats:' + stats +', Sockets: ' + sockets.length);
}, 1000);


process.stdin.resume();
process.on('SIGINT', function () {
for(var i=0;i<process.argv[2];i++){
sockets[i].destroy();
console.log(sockets.length - i -1);
}
process.exit();
});

