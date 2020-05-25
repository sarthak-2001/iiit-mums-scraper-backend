const express = require("express");
const loginRouter = require("./mums/routes/login");
const noticeRouter = require("./mums/routes/notices")

const app = express();

app.use(express.json());

app.use(loginRouter);
app.use(noticeRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server on ${PORT}`));
