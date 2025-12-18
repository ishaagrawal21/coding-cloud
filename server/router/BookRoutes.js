const express = require("express");
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("../controller/book.controller");

const router = express.Router();

router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;





