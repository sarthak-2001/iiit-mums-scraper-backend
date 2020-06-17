const mongoose = require("mongoose");

const intraNoticeSchema = new mongoose.Schema({
	
	date: {
		default: "",
		type: String,
	},
	id: {
		default: "",
		unique: true,
		type: Number,
	},
	id_link: {
		default: "",
		type: String,
	},
	posted_by: {
		default: "",
		type: String,
	},
	title: {
		default: "",
		type: String,
	},
	content: {
		default: "",
		type: String,
	},
	attachment: {
		default: "",
		type: String,
	},
});

const intraNotice = mongoose.model("intraNotices", intraNoticeSchema);

module.exports = intraNotice;
