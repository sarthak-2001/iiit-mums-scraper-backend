const express = require("express");
const { facultyList } = require("../functions/facultyList");

const router = new express.Router();

router.post("/facList", async (req, res) => {
  let faculty = await facultyList(req.body.uid, req.body.pwd);

  if (!faculty) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json(faculty);
});

module.exports = router;
