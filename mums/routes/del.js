const express = require("express");
const { noticeUpdater } = require("../functions/notices_scraper");
var path = require("path");

const router = new express.Router();

router.get("/test", async (req, res) => {
	// req.io.on('connection',(socket)=>{
	//     console.log('client11 connect');

	// })
	// req.io.sockets.on('connection', function (socket) {
	//     console.log('client11 connect');
	//     // socket.on('echo', function (data) {
    //         req.io.sockets.emit("update1", "hu");

	//     //     io.sockets.emit('message', data);
	//     });
	//     socket.emit("update1","hello1")

	// });

	// req.io.emit("update1","hello1")
	noticeUpdater(req.body.uid, req.body.pwd, req.io.sockets);

	res.sendFile(path.join(__dirname + "/test.html"));
});

module.exports = router;
