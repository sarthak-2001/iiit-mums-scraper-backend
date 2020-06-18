const express = require("express");

require("./mums/db/mongoose");

const loginRouter = require("./mums/routes/login");
const noticeRouter = require("./mums/routes/notices");
const gradesRouter = require("./mums/routes/grades");
const studentRouter = require("./mums/routes/stuSearch");
const studentImageRouter = require("./mums/routes/stuImage");
const facultyRouter = require("./mums/routes/facSearch");
const facListRouter = require("./mums/routes/facList");
const facultyImageRouter = require("./mums/routes/facImage");
const intraRouter = require("./mums/routes/intraNotices");
const bookRouter = require("./mums/routes/booksearch");
const attendanceRouter = require("./mums/routes/attendance");


const delRouter = require('./mums/routes/del')

const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 3001;

const io = require('socket.io')(server);
server.listen(PORT);

app.use(function(req,res,next){
    req.io = io;
    next();
});

// io.sockets.on('connection', function (socket) {
//     console.log('client connect');
//     // socket.on('echo', function (data) {
//     //     io.sockets.emit('message', data);
//     // });
    
// });

app.use(express.json());

app.use(loginRouter);
app.use(noticeRouter);
app.use(gradesRouter);
app.use(studentRouter);
app.use(studentImageRouter);
app.use(facultyRouter);
app.use(facListRouter);
app.use(facultyImageRouter);
app.use(intraRouter);
app.use(bookRouter);
app.use(attendanceRouter);
app.use(gradesRouter);

app.use(delRouter);


// app.listen(PORT, () => console.log(`server on ${PORT}`));
