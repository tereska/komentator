var META       = /^\/meta\//,
    SERVICE    = /^\/service\//,
    CLUSTER    = /^\/faye\/cluster\//;

var Supervizor = function() {};

Supervizor.prototype.added = function(server) {
	this.server = server;
};

Supervizor.prototype.incoming = function(message, callback) {
	var channel = message.channel;
	
	if (channel.indexOf('/faye/cluster/endpoint') > -1 && message.data) {
		if(message.data.username && message.data.password) {
			delete message.data.username;
			delete message.data.password;
		} else {
			message.error = "YOU CANT PUBLISH!";
		}
	}
	callback(message);
};

module.exports = Supervizor;

