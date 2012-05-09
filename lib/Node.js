var faye       = require('faye'),
    Connection = require('./Connection.js'),
    META       = /^\/meta\//,
    SERVICE    = /^\/service\//,
    CLUSTER    = /^\/faye\/cluster\//;

var Node = function(endpoint, username, password) {
  this._endpoint    = endpoint;
  this._connections = {};
  // auth for messages routing
  this._username = username;
  this._password = password;
};

Node.prototype.added = function(server) {
  this._server = server;
  this._client = new faye.Client(server);
  this._client.subscribe('/faye/cluster/endpoint', function(endpoint) {
    this.connect(endpoint.endpoint);
    this._client.publish(
		  '/faye/cluster/endpoints', {
		  endpoints: Object.keys(this._connections), 
      username: this._username,
      password: this._password
    });
  }, this);
};

Node.prototype._initForward = function(message, denied, user, pass){
  var channel = message.channel;
  if (META.test(channel) || SERVICE.test(channel) || CLUSTER.test(channel)) return;
  if (message.ext && message.ext.cluster) return;
  if (denied) return;
  if(user!=null && pass!=null){
      message.data.username = user;
      message.data.password = pass;
  }
  this._forward(message);
};

Node.prototype.incoming = function(message, callback) {

  var channel = message.channel;
  var user = null;
  var pass = null;
  var denied = false;
  
  if ((channel.indexOf('/faye/cluster/endpoint') > -1 && message.data) ||
      (channel.indexOf('/onet/') > -1 && message.data) ) {
    		
        if (message.data.username == this._username &&
            message.data.password == this._password) {
          user = message.data.username;
          pass = message.data.password;
    			delete message.data.username;
    			delete message.data.password;
    		} else {
          denied = true;
    			message.error = "PUBLISH_DENIED";
          console.log('PUBLISH_DENIED');
    		}
	}
 
  this._initForward(message, denied, user, pass);
  callback(message);
};

Node.prototype.outgoing = function(message, callback) {
  if (message.ext) delete message.ext.cluster;
  callback(message);
};

Node.prototype.connect = function(endpoints) {
  endpoints = [].concat(endpoints);
  
  var i = endpoints.length,
      conns = this._connections,
      endpoint;
  
  while (i--) {
    endpoint = endpoints[i];
    if (endpoint !== this._endpoint) {
      conns[endpoint] = conns[endpoint] || new Connection(this, endpoint, this._username, this._password);
	  }
  }
};

Node.prototype._forward = function(message) {
  message.ext = message.ext || {};
  message.ext.cluster = {publish: true};
  for (var endpoint in this._connections)
    this._connections[endpoint].forward(message);
};

module.exports = Node;

