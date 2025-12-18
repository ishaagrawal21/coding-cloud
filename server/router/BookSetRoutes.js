const express = require("express");
const {
  createBookSet,
  getBookSets,
  updateBookSet,
  deleteBookSet,
} = require("../controller/bookSet.controller");

const router = express.Router();

// Book Set APIs as per requirements
router.post("/create", createBookSet);
router.get("/", getBookSets);
router.put("/:id", updateBookSet);
router.delete("/:id", deleteBookSet);

module.exports = router;





