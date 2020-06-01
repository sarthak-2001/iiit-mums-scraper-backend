const express = require("express");
const { bookSearch } = require("../functions/booksearch");

const router = new express.Router();

router.post("/booksrch", async (req, res) => {
  console.log('here');
  
  let books = await bookSearch(
    req.body.uid,
    req.body.pwd,
    req.body.search
  );

  if (!books) {
    res.status(500).json({ msg: "ERROR" });
  } else res.status(200).json(books);
});

module.exports = router;
