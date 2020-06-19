const express = require("express");
const { intraDBCreator } = require("../functions/intranetResources");
const router = new express.Router();

router.post("/intrapop", async (req, res) => {
	await intraDBCreator(req.body.uid, req.body.pwd);
	res.status(200).json({ msg: "received" });
});

module.exports = router;
