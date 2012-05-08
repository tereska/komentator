var faye = require('faye');
var clients = [];
var stats = 0;
var handler = function () { stats += 1; };

var connHandler = function(){
  if(clients.length >= process.argv[4]){
    console.log('clients created');
  } else {
    makeClient();
  }
}

function makeClient(){
  var index = clients.push(new faye.Client('http://' + process.argv[2] + ':' + process.argv[3] + '/dl'));
  index -= 1;
  clients[index].bind('transport:up', connHandler);
  clients[index].subscribe('/onet/sport', handler);
}
makeClient();

setInterval(function(){
  console.log('Messages:' + stats +', Clients: ' + clients.length);
}, 1000);


process.stdin.resume();
process.on('SIGINT', function () {
  for(var i=0,max=clients.length;i<max;i++){
    clients[i].disconnect();
  }
  console.log('done');
  setTimeout(process.exit, 1000);
});

