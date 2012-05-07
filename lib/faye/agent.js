var META       = /^\/meta\//,
    SERVICE    = /^\/service\//,
    CLUSTER    = /^\/faye\/cluster\//;

var Agent = function(endpoint) {};

Agent.prototype.incoming = function(message, callback) {
	var channel = message.channel;
	if (!META.test(channel) && !SERVICE.test(channel) && !CLUSTER.test(channel)) {
		console.log('AGENT incoming: ', message);
	}
	callback(message);
};

Agent.prototype.outgoing = function(message, callback) {
	var channel = message.channel;
	if (!META.test(channel) && !SERVICE.test(channel) && !CLUSTER.test(channel)) {
		console.log('AGENT outgoing: ', message);
	}
	callback(message);
};

module.exports = Agent;

