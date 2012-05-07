var ZooKeeper = require ("zookeeper");
var zk = new ZooKeeper({
  connect: "localhost:2181"
 ,timeout: 200000
 ,debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARNING
 ,host_order_deterministic: false
});
zk.connect(function (err) {
    if(err) throw err;
    console.log ("zk session established, id=%s", zk.client_id);
	
    zk.a_create ("/mesh/node_"+Date.now(), "localhost:9000", ZooKeeper.ZOO_EPHEMERAL, function (rc, error, path)  {
        if (rc != 0) {
            console.log ("zk node create result: %d, error: '%s', path=%s", rc, error, path);
        } else {
            console.log ("created zk node %s", path);
            process.nextTick(function () {
                //zk.close ();
            });
        }
    });
	
	attachNode(zk);
	
});

function attachNode(zk){
    zk.aw_get_children( '/mesh', function ( type, state, path ){
		console.log('watch', arguments);
		attachNode(zk);
	}, function ( rc, error, children ){
		console.log('data', arguments);
	});
}
