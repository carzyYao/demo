var zmq = require('zmq')
  , sock_pub = zmq.socket('pub')
  , sock_rep = zmq.socket('rep')
  , port_rep = 'tcp://127.0.0.1:12346'
  , port_pub = 'tcp://127.0.0.1:3000';

// push bind
sock_pub.bindSync(port_pub);
console.log('Publisher bound to port 3000');

// req bind
sock_rep.bind(port_rep, function(err) {
	console.log("start connection");

	//接收訊息 並且利用pub 廣播到sub 端
	sock_rep.on('message', function(data) {
		var message = JSON.parse(data.toString());
	    console.log(  message.userName + ': ' + message.txt );
	    sock_rep.send(data);

	    //sub send
	    sock_pub.send(['kitty cats', data]);
	});
});




