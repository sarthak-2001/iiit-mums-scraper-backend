const noticeLock = require("../models/noticeLock");
const { noticeUpdater } = require("../functions/notices_scraper");
const { outsideNoticeUpdater } = require("../functions/notice_outside");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const notice_middleware = async (req, res, next) => {
	try {
		let lock = await noticeLock.findOne({});
		if(lock==null){
		await	noticeLock.updateOne(
			{ name: "Noticelock" },
			{ $set: { global_lock: false } },
			{ upsert: true }
		);
		}
		if (lock.global_lock == false) {
			outsideNoticeUpdater();
			await sleep(5000);
			noticeUpdater(req.body.uid, req.body.pwd);
		}
		next();
	} catch (e) {
		console.log(e);
	}
};
module.exports = notice_middleware;
