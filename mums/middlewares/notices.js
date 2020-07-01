const noticeLock = require("../models/noticeLock");
const {noticeUpdater} = require("../functions/notices_scraper");
const { outsideNoticeUpdater } = require("../functions/notice_outside");
const notice_middleware = async (req, res, next) => {
	try {
		let lock = await noticeLock.findOne({});
		if (lock.global_lock == false) {
			outsideNoticeUpdater();
			noticeUpdater(req.body.uid, req.body.pwd);
		}
		next();
	} catch (e) {
		console.log(e);
	}
};
module.exports = notice_middleware;
