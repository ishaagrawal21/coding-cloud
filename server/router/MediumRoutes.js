const express = require("express");
const {
  createMedium,
  getMediums,
  getMedium,
  updateMedium,
  deleteMedium,
} = require("../controller/medium.controller");

const router = express.Router();

router.post("/", createMedium);
router.get("/", getMediums);
router.get("/:id", getMedium);
router.put("/:id", updateMedium);
router.delete("/:id", deleteMedium);

module.exports = router;





