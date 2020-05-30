const express = require("express");
const { studentImage } = require("../functions/stuImage");

const router = new express.Router();

router.post("/stuimg", async (req, res) => {
  let imageLink = await studentImage(req.body.uid, req.body.pwd, req.body.link);

  if (!imageLink) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json({ link: imageLink });
});

module.exports = router;
