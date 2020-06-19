const express = require("express");
const { noticeDBcreator } = require("../functions/notices_scraper");
const router = new express.Router();

router.post("/noticepop", async (req, res) => {
    console.log('notice populator route');
    
	await noticeDBcreator(req.body.uid, req.body.pwd);
	res.status(200).json({ msg: "received" });
});

module.exports = router;
