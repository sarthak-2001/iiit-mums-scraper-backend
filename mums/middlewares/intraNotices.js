const { intraUpdater } = require("../functions/intranetResources");
const intraNoticeLock = require("../models/intranetLock");

const intraNotice_middleware = async (req, res, next) => {
	try {
		let lock = await intraNoticeLock.findOne({});
		if(lock==null)
		await intraNoticeLock.updateOne(
			{ name: "IntraNoticelock" },
			{ $set: { global_lock: false } },
			{ upsert: true }
		);
		if (lock.global_lock == false) {
			intraUpdater(req.body.uid, req.body.pwd);
		}
		next();
	} catch (e) {
		console.log(e);
	}
};
module.exports = intraNotice_middleware;