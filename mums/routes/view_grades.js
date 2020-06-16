const express = require("express");
const { gradeScraper } = require("../functions/gradesDetailed");

const router = new express.Router();

router.post("/grades/:sem", async (req, res) => {
  let sem = req.params.sem;
  let grades = await gradeScraper(req.body.uid,req.body.pwd,sem)
  

  if (!grades) {
    res.status(500).json({ msg: "ERROR" });
  } else if (grades == "error") {
    res.status(400).json({ msg: "wrong user id" });
  } else res.status(200).json({ msg: "success" });
}); 

module.exports = router;
