const express = require("express");
const { sgpaScraper } = require("../functions/sem");

const router = new express.Router();

router.post("/sem", async (req, res) => {
  let sems = await sgpaScraper(req.body.uid, req.body.pwd);

  if (!sems) {
    res.status(500).json({ msg: "ERROR" });
  
  } else res.status(200).json(sems );
});

module.exports = router;
