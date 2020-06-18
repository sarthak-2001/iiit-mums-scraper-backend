const express = require("express");
const intra_middleware = require('../middlewares/intraNotices')
const intraModel  =  require('../models/intranet')
const router = new express.Router();

router.post("/intra", intra_middleware,async (req, res) => {
  let notices = await intraModel.find({}).sort({id:-1});

  if (!notices) {
    res.status(500).json({ msg: "ERROR" });
  }else res.status(200).json(notices);
});

module.exports = router;