var spawn = require('child_process').spawn;
var proc = [];
for (var i=0;i<process.argv[2];i++){
proc.push(spawn('node', ['fconn.js', 10000]))
}  

