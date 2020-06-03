const express = require("express");
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


const app = express();

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`server on ${PORT}`));
