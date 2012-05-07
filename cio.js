var io = require('socket.io-client');
var stats = 0;
var msg   = 0;
var sockets = [];

var connectHandler = function(){
  stats += 1;
  if(sockets.length >= process.argv[2]){
    console.log('clients created');
    return;
  } else {
    makeClient();
  }

};
var barHandler = function(){
  msg += 1;
};
var disconnectHander = function(){
  stats -= 1;
};
function makeClient(){
process.nextTick(function(){
  var socket = io.connect('http://localhost:8080', {'force new connection': true, 'transports':['websocket']});
  socket.on('connect', connectHandler);
  socket.on('bar', barHandler);
  socket.on('disconnect', disconnectHander);
  sockets.push(socket);
},1);
}
makeClient();

setInterval(function(){
  console.log('connections: ' + stats + '  msg: ' + msg);
},1000);

