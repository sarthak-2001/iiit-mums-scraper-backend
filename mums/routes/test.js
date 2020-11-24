const express = require("express");
const router = new express.Router();

router.get("/test", async (req, res) => {
	console.log("test route");

	res.status(200).send("hello tester");
});

module.exports = router;
