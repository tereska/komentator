var faye    = require('faye'),
    FORWARD = '/faye/cluster/forward';

var Connection = function(node, endpoint, username, password) {
  this._node     = node;
  this._endpoint = endpoint;
  this._remote   = new faye.Client(endpoint);
  this._username = username;
  this._password = password;
  
  // if some server will go down delete him from peers
  this._remote.bind('transport:down', function() {
	  delete this._node._connections[this._endpoint];
  }, this);
  
  this._remote.addExtension(this);
  
  var sub = this._remote.subscribe('/faye/cluster/endpoints', function(endpoints) {
	  this._node.connect(endpoints.endpoints);
  }, this);
  
  sub.callback(function() {
    this._remote.publish('/faye/cluster/endpoint', {
      endpoint: this._node._endpoint, 
      username: username, 
      password: password
    });
  }, this);
};

Connection.prototype.outgoing = function(message, callback) {
  if (message.channel === FORWARD) {
    message.channel = message.data.channel;
    message.ext = message.data.ext;
    message.data = message.data.data;
  }
  callback(message);
};

Connection.prototype.forward = function(message) {
  this._remote.publish(FORWARD, message);
};

module.exports = Connection;

