var http = require('http');
var dns = require('dns');
var os = require('os');
var faye = require('faye');

var Node = require('./lib/Node.js');
var Supervizor = require('./lib/Supervizor.js');

var port    = process.argv[2],
	remoteHost  = process.argv[3],
	remotePort = process.argv[4],
	mount = '/dl',
	node = null,
	server = null,
	httpServer = null,
	nodeUrl = null,
	host = 'localhost',
	supervizor = null;

dns.resolve(os.hostname(), function(err, ips){
    if(!err && ips && ips[0]){
        host = ips[0];
    }
    httpServer = http.createServer(function(request, response) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        var nodes = {};
        nodes[nodeUrl] = {};
        var edges = {};
        edges[nodeUrl] = {};
        var keys = Object.keys(node._connections);
        for(var i=0;i<keys.length;i++){
            edges[nodeUrl][keys[i]] = {};
        }
        response.end(JSON.stringify({nodes: nodes, edges: edges}));
    });
    httpServer._backlog = 100000;
	
	  nodeUrl = 'http://' + host + ':' + port + mount;
    server = new faye.NodeAdapter({mount: mount, timeout: 3600});
	  //server.addExtension(new Supervizor('sj', 'sj'));
	  node = new Node(nodeUrl, 'sj', 'sj');
	  server.addExtension(node);
    server.attach(httpServer);
    httpServer.listen(port);
    if (remoteHost && remotePort) {
        node.connect('http://' + remoteHost + ':' + remotePort + mount);
    }
});


process.stdin.resume();
process.stdin.setEncoding('utf8');
var intMsg = null;
process.stdin.on('data', function (chunk) {
    if(chunk.indexOf('start') > -1){
        intMsg = setInterval(function(){
           server.getClient().publish('/onet/sport', Date.now());
        }, 10000);
    } else if (chunk.indexOf('stop') > -1) {
        clearInterval(intMsg);
    } else if (chunk.indexOf('exit') > -1) {
        process.exit();
    }
});
