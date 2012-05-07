var faye = require('faye');
var clients = [];
var stats = 0;


var handler = function(){
  stats += 1;
};


function makeClient(){
setTimeout(function(){
  if(clients.length >= process.argv[2]){
    console.log('clients created');
    return;
  }
  clients.push(new faye.Client('http://localhost:8080/faye'));
  clients[clients.length-1].subscribe('/foo', handler);
  makeClient();
}, 1);
}

makeClient();

//setInterval(function(){
//  console.log('Messages:' + stats +', Clients: ' + clients.length);
//}, 1000);


process.stdin.resume();
process.on('SIGINT', function () {
  for(var i=0;i<process.argv[2];i++){
    clients[i].disconnect();
  }
  console.log('done');
  setTimeout(function(){
    process.exit();
  }, 5000)
});

