const express = require("express");
const loginRouter = require("./mums/routes/login");
const noticeRouter = require("./mums/routes/notices");
const gradesRouter = require("./mums/routes/view_grades");

const app = express();

app.use(express.json());

app.use(loginRouter);
app.use(noticeRouter);
app.use(gradesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`server on ${PORT}`));
