const express = require("express");
const loginRouter = require("./mums/routes/login");
const noticeRouter = require("./mums/routes/notices");
const studentRouter = require("./mums/routes/stuSearch");
const studentImageRouter = require("./mums/routes/stuImage");

const app = express();

app.use(express.json());

app.use(loginRouter);
app.use(noticeRouter);
app.use(studentRouter);
app.use(studentImageRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`server on ${PORT}`));
