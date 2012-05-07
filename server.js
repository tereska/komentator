var http = require('http'),
	dns = require('dns'),
	os = require('os'),
	faye    = require('faye'),
	cluster = require('./lib/faye/cluster'),
	port    = process.argv[2],
	remoteHost  = process.argv[3],
	remotePort = process.argv[4],
	mount = '/faye',
	node = null,
	server = null,
	httpServer = null,
	nodeUrl = null,
	host = 'localhost',
	Agent = require('./lib/faye/agent.js'),
	agent = null,
	Supervizor = require('./lib/faye/supervizor.js'),
	supervizor = null;

dns.resolve(os.hostname(), function(err, ips){
    if(ips && ips[0]){
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
	
	nodeUrl = 'http://' + host + ':' + port + mount;
    server = new faye.NodeAdapter({mount: mount});
	supervizor = new Supervizor();
	server.addExtension(supervizor);
	node = new cluster.Node(nodeUrl);
	server.addExtension(node);
	agent = new Agent();
	//server.addExtension(agent);
    server.attach(httpServer);
    httpServer.listen(port);
    if (remoteHost && remotePort) {
        node.connect('http://' + remoteHost + ':' + remotePort + mount);
    }
});



