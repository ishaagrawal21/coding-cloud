const express = require("express");
const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} = require("../controller/board.controller");

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;





