const express = require("express");
const { facultyImage } = require("../functions/facImage");

const router = new express.Router();

router.post("/facimg", async (req, res) => {
  let imageLink = await facultyImage(req.body.uid, req.body.pwd, req.body.link);

  if (!imageLink) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json({ link: imageLink });
});

module.exports = router;
