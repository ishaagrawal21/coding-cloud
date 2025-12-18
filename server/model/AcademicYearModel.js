const mongoose = require("mongoose");

const AcademicYearSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // e.g. "2024-2025"
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicYear", AcademicYearSchema);





