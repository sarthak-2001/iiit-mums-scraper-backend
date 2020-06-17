const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
	attention: {
		default: "",
		type: String,
	},
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

const Notice = mongoose.model("notices", noticeSchema);

module.exports = Notice;
