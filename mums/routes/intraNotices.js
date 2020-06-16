const express = require("express");
const { intraUpdater } = require("../functions/intranetResources");

const router = new express.Router();

router.post("/intra", async (req, res) => {
  let notices = await intraUpdater(req.body.uid, req.body.pwd);

  if (!notices) {
    res.status(500).json({ msg: "ERROR" });
  } else if (notices == "error") {
    res.status(400).json({ msg: "wrong user id" });
  } else res.status(200).json({ msg: "success" });
});

module.exports = router;