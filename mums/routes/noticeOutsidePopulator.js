const express = require("express");
const { outsideNoticeDBCreator } = require("../functions/notice_outside");
const router = new express.Router();

router.post("/noticeoutpop", async (req, res) => {
    console.log('notice populator route');
    
	await outsideNoticeDBCreator();
	res.status(200).json({ msg: "received" });
});

module.exports = router;
