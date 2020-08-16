const express = require("express");
const { nameScraper } = require("../functions/getname");

const router = new express.Router();

router.post("/name", async (req, res) => {
  let name = await nameScraper(req.body.uid, req.body.pwd);

  if (!name) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json({ name: name });
});

module.exports = router;
