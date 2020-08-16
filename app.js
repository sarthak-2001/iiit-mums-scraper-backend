const express = require("express");
require("dotenv").config();

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
const noticePopRouter = require("./mums/routes/noticePopulator");
const intraPopulator = require("./mums/routes/intraPopulator");
const noticeOutPopulator = require("./mums/routes/noticeOutsidePopulator");
const nameRoute = require("./mums/routes/name");
const semRouter = require('./mums/routes/sgpa');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(loginRouter);
app.use(noticeRouter);
app.use(gradesRouter);
app.use(intraPopulator);
app.use(noticePopRouter);
app.use(studentRouter);
app.use(studentImageRouter);
app.use(facultyRouter);
app.use(semRouter);
app.use(facListRouter);
app.use(facultyImageRouter);
app.use(intraRouter);
app.use(nameRoute);
app.use(bookRouter);
app.use(attendanceRouter);
app.use(gradesRouter);
app.use(noticeOutPopulator);

app.listen(PORT, () => console.log(`server on ${PORT}`));
