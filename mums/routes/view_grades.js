const express = require("express");
const { grade_scraper } = require("../functions/view_grades");

const router = new express.Router();

router.post("/grades/:coid", async (req, res) => {
  let coid = req.params.coid;
  let grades = await grade_scraper(req.body.uid,req.body.pwd,coid)
  

  if (!grades) {
    res.status(500).json({ msg: "ERROR" });
  } else if (grades == "error") {
    res.status(400).json({ msg: "wrong user id" });
  } else res.status(200).json({ msg: "success" });
}); 

module.exports = router;
