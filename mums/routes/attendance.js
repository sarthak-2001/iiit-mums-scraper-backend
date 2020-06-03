const express = require("express");
const { attendanceScraper } = require("../functions/attendance");

const router = new express.Router();

router.post("/attendance", async (req, res) => {
  let attendance = await attendanceScraper(req.body.uid, req.body.pwd);

  if (!attendance) {
    res.status(500).json({ msg: "ERROR" });
  } else if (attendance == "error") {
    res.status(400).json({ msg: "wrong user id" });
  } else res.status(200).json({ msg: "success" });
});

module.exports = router;
