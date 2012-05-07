var faye = require('faye');
var stats = 0;
var bayeux = new faye.NodeAdapter({mount: '/faye'});
bayeux.listen(8080);

bayeux.bind('subscribe', function(clientId, channel) {
  stats += 1;
});

bayeux.bind('unsubscribe', function(clientId, channel) {
  stats -= 1;
});




var client = bayeux.getClient();

setInterval(function () {
    client.publish('/foo', 'New email arrived!');
}, 5000);

setInterval(function () {
   console.log(stats);
}, 1000);
