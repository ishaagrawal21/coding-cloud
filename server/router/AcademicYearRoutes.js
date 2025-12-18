const express = require("express");
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../controller/academicYear.controller");

const router = express.Router();

router.post("/", createAcademicYear);
router.get("/", getAcademicYears);
router.get("/:id", getAcademicYear);
router.put("/:id", updateAcademicYear);
router.delete("/:id", deleteAcademicYear);

module.exports = router;





