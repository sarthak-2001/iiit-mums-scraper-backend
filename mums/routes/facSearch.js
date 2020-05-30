const express = require("express");
const { facultySearch } = require("../functions/facultySearch");

const router = new express.Router();

router.post("/facSrch", async (req, res) => {
  let faculty = await facultySearch(
    req.body.uid,
    req.body.pwd,
    req.body.search
  );

  if (!faculty) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json(faculty);
});

module.exports = router;
