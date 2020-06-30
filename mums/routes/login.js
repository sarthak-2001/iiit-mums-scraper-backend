const express = require("express");
const { login } = require("../functions/login");

const router = new express.Router();

router.post("/login", async (req, res) => {
  let user = await login(req.body.uid, req.body.pwd);
  if (!user) res.status(500).json({ msg: "ERROR" });

  if (user.isValid == false) {
    res.status(200).json({ msg: "Inavlid ID or password" });
  } else {
    res.status(200).json({ msg: "Welcome" });
  }
});

module.exports = router;
