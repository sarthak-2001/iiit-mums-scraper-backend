const mongoose = require("mongoose")

const lockSchema = new mongoose.Schema({
	global_lock: {
		type: Boolean,
		default: false
	},
	name: {
		type: String,
		default: "IntraNoticelock"
	},
	last_updated: {
		type: Date
	},
})

const Lock = mongoose.model("IntraNoticeLock", lockSchema)

module.exports = Lock