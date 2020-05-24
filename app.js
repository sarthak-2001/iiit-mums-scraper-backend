const express = require("express");
const loginRouter = require("./mums/routes/login");

const app = express();

app.use(express.json());

app.use(loginRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server on ${PORT}`));
