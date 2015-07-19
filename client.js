var readlineMoudel = require('readline')
var zmq = require('zmq')
  , sock_sub = zmq.socket('sub')
  , sock_req = zmq.socket('req')
  , port_req = 'tcp://127.0.0.1:12346'
  , port_sub = 'tcp://127.0.0.1:3000'
  , sendString
  , userName; 

//輸入使用者名稱
var readUser = readlineMoudel.createInterface({ input: process.stdin,output: process.stdout });

//詢問 訪客名稱
readUser.setPrompt("please input your user Name!::");
readUser.prompt();
readUser.on('line', function (cmd) { 
	userName = cmd;
	console.log("userName::" + userName);
	readUser.pause();
}, 500);

// readUser.close();

readUser.on('pause', function() {
	readUser.close();

	//輸入 傳送內容
	var readline = readlineMoudel.createInterface({ input: process.stdin,output: process.stdout });
	readline.setPrompt(userName + ":", 6);
	readline.prompt();

  	//req 連線
  	sock_req.connect(port_req);

  	//sub連線
  	sock_sub.connect(port_sub);
	sock_sub.subscribe('kitty cats');

	sock_sub.on('message', function(topic, message) {

		var Jmessage = JSON.parse(message.toString());
		var otherUser = Jmessage.userName;
		var otherTxt = Jmessage.txt;

		//command line 顯示處理
		if(otherUser == userName){
			readline.setPrompt(userName + ":");
			readline.prompt();

		}else {
			readline.setPrompt(">");
			readline.prompt();

			console.log(otherUser + ":" + otherTxt);

			//切換單下自己的使用者名稱
			readline.setPrompt(userName + ":");
			readline.prompt();

		}
	});

	readline.on('line', function (cmd) { 
		//readline.prompt();
		
		sendString = { 
			'userName' :userName,
			'txt' : cmd
			
		};

		var jString = JSON.stringify(sendString);

	    //send message
	    sock_req.send(jString);

	});

});



// //exit this push
// readline.on('close', function() {
  
//   sock_push.close();

//   console.log('sock_push is closed!!');
// });

