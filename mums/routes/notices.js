const express = require("express");
// const { noticeUpdater } = require("../functions/notices_scraper");
const notice = require("../models/notice");
const notice_middleware = require("../middlewares/notices");
const router = new express.Router();

router.post("/notices", notice_middleware, async (req, res) => {
	let notices = await notice.find({}).sort({ id: -1 });

	if (!notices) {
		res.status(500).json({ msg: "ERROR" });
	} else res.status(200).json(notices);
});

module.exports = router;
