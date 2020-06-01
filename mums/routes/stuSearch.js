const express = require("express");
const { studentSearch } = require("../functions/stuSearch");

const router = new express.Router();

router.post("/students", async (req, res) => {
  let students = await studentSearch(
    req.body.uid,
    req.body.pwd,
    req.body.search
  );

  if (!students) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json(students);
});

module.exports = router;
