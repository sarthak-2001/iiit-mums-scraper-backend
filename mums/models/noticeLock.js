const mongoose = require("mongoose")

const lockSchema = new mongoose.Schema({
	global_lock: {
		type: Boolean,
		default: false
	},
	name: {
		type: String,
		default: "Noticelock"
	},
	last_updated: {
		type: Date
	},
})

const Lock = mongoose.model("NoticeLock", lockSchema)

module.exports = Lock