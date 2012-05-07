var faye = require('faye');
var clients = [];
var stats = 0;


var handler = function(){
  stats += 1;
};
var connHandler = function(){
  if(clients.length >= process.argv[2]){
    console.log('clients created');
  } else {
    makeClient();
  }
}

function makeClient(){
  clients.push(new faye.Client('http://localhost:8080/faye'));
  var index = clients.length-1;
  clients[index].bind('transport:up', connHandler);
  clients[index].subscribe('/foo', handler);
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
  setTimeout(function(){
    process.exit();
  }, 1000)
});

