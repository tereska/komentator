
var Agent = function() {};
Agent.prototype.incoming = function(message, callback) {
	console.log('AGENT incoming: ', message);
	if (message.hasOwnProperty('data')) {
		message.error = "You can't publish!";
	}
	callback(message);
};
Agent.prototype.outgoing = function(message, callback) {
	console.log('AGENT outgoing: ', message);
	callback(message);
};


var agent = new Agent();

var faye      = require('faye'),
    fayeRedis = require('faye-redis');

var server = new faye.NodeAdapter({
  mount:    '/faye',
  timeout:  45,
  engine:   {
    type:   fayeRedis,
    host:   'localhost',
    port:   6379
  }
});

server.addExtension(agent);
server.listen(9000);

