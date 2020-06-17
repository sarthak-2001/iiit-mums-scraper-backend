 
const mongoose = require("mongoose")

mongoose.connect("mongodb://172.17.0.2:27017/canopy", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
	useUnifiedTopology:true,
})